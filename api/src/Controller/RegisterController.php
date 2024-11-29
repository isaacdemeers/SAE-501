<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\AmazonS3Service;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class RegisterController extends AbstractController
{
    private $s3Service;
    private $params;
    #[Route('/users/{id}', name: 'app_users_update', methods: ['PATCH'])]
    public function updateUser(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): Response {
        $data = json_decode($request->getContent(), true);
        $user = $entityManager->getRepository(User::class)->find($id);

        if (null === $user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Mise à jour du username
        if (isset($data['username'])) {
            $existingUser = $entityManager->getRepository(User::class)->findOneBy(['username' => $data['username']]);
            if (null !== $existingUser && $existingUser->getId() !== $user->getId()) {
                return $this->json(['message' => 'Username already exists'], Response::HTTP_CONFLICT);
            }
            $user->setUsername($data['username']);
        }

        // Mise à jour du firstname
        if (isset($data['firstname'])) {
            $user->setFirstname($data['firstname']);
        }

        // Mise à jour du lastname
        if (isset($data['lastname'])) {
            $user->setLastname($data['lastname']);
        }

        // Mise à jour de l'email
        if (isset($data['email'])) {
            $existingEmail = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if (null !== $existingEmail && $existingEmail->getId() !== $user->getId()) {
                return $this->json(['message' => 'Email already exists'], Response::HTTP_CONFLICT);
            }
            $user->setEmail($data['email']);
        }

        // Mise à jour du mot de passe
        if (isset($data['oldPassword'], $data['newPassword'])) {
            if (!$passwordHasher->isPasswordValid($user, $data['oldPassword'])) {
                return $this->json(['message' => 'Old password is incorrect'], Response::HTTP_BAD_REQUEST);
            }

            $newHashedPassword = $passwordHasher->hashPassword($user, $data['newPassword']);
            $user->setPassword($newHashedPassword);
        }

        // Persistance des modifications
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'User updated successfully'], Response::HTTP_OK);
    }

    public function __construct(AmazonS3Service $s3Service, ParameterBagInterface $params)
    {
        $this->s3Service = $s3Service;
        $this->params = $params;
    }

    #[Route('users/testemail', name: 'app_users_email', methods: ['POST'])]
    public function checkEmail(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (null === $email) {
            return $this->json(['message' => 'Email is missing: ' . $email], Response::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (null !== $user && in_array('ROLE_USER', $user->getRoles())) {
            return $this->json(['message' => 'Email already exists'], Response::HTTP_CONFLICT);
        }

        return $this->json(['message' => 'OK'], Response::HTTP_OK);
    }

    #[Route('users/testusername', name: 'app_users_username', methods: ['POST'])]
    public function checkUsername(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? null;

        if (null === $username) {
            return $this->json(['message' => 'Username is missing: ' . $username], Response::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (null !== $user) {
            return $this->json(['message' => 'Username already exists'], Response::HTTP_CONFLICT);
        }

        return $this->json(['message' => 'OK'], Response::HTTP_OK);
    }

    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, MailerInterface $mailer, UrlGeneratorInterface $urlGenerator): Response
    {
        // Récupérer les données JSON et le fichier
        $data = json_decode($request->request->get('data'), true);
        $file = $request->files->get('file');

        // Vérifier si un utilisateur existe déjà par email
        $existingUserByEmail = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        $existingUserByUsername = $entityManager->getRepository(User::class)->findOneBy(['username' => $data['username']]);

        if (null !== $existingUserByEmail && in_array('ROLE_INVITE', $existingUserByEmail->getRoles())) {
            // Mettre à jour les informations de l'utilisateur existant
            $user = $existingUserByEmail;
        } elseif (null !== $existingUserByEmail || null !== $existingUserByUsername) {
            return $this->json(['message' => 'User already exists'], Response::HTTP_CONFLICT);
        } else {
            $user = new User();
            $user->setEmail($data['email']);
        }

        // Hachage du mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Champs facultatifs
        $user->setFirstname($data['firstname'] ?? 'DefaultFirstname');
        $user->setLastname($data['lastname'] ?? 'DefaultLastname');
        $user->setUsername($data['username'] ?? 'DefaultUsername');
        $user->setRoles(['ROLE_USER']);
        $user->setCreatedAt(new \DateTimeImmutable());
        // Génération du token de confirmation d'email
        $confirmationToken = Uuid::v4()->toRfc4122();
        $user->setEmaillink($confirmationToken);

        // Gestion de l'image
        if ($file) {
            $imageName = uniqid() . '.' . $file->guessExtension();
            // Upload de l'image sur S3
            $uploaded = $this->s3Service->uploadObject($imageName, $file->getPathname());
            if ($uploaded) {
                $user->setPhoto($imageName); // Enregistrer le nom de fichier dans l'utilisateur
            } else {
                return $this->json(['message' => 'Failed to upload image to S3.'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } else {
            $user->setPhoto('logimg.png');
        }

        $entityManager->persist($user);
        $entityManager->flush();

        // Génération du lien de vérification
        $appUrl = $this->params->get('APP_URL');
        $verificationLink = $appUrl . '/verify-email/' . $confirmationToken;

        // Envoi de l'email de confirmation
        $email = (new Email())
            ->from('no-reply@example.com')
            ->to($user->getEmail())
            ->subject('Please Confirm your Email')
            ->html('<p>Please confirm your email by clicking on the following link: <a href="' . $verificationLink . '">Verify Email</a></p>');

        $mailer->send($email);

        return $this->json(['message' => 'User created successfully'], Response::HTTP_CREATED);
    }

    public function __invoke(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, MailerInterface $mailer, UrlGeneratorInterface $urlGenerator): Response
    {
        return $this->register($request, $entityManager, $passwordHasher, $mailer, $urlGenerator);
    }

    #[Route('/verify-email', name: 'app_confirm_email', methods: ['POST'])]
    public function verifyEmail(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['emailtoken'] ?? null;

        if (null === $token) {
            return $this->json(['message' => 'Token is missing'], Response::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['emaillink' => $token]);

        if (null === $user) {
            return $this->json(['message' => 'Invalid token'], Response::HTTP_BAD_REQUEST);
        }

        $user->setEmailverify(true);
        $user->setEmaillink("");

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'Email verified successfully'], Response::HTTP_OK);
    }
}
