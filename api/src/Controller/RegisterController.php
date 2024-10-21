<?php
namespace App\Controller;

use App\Entity\User;
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


class RegisterController extends AbstractController
{

    #[Route('users/testemail', name: 'app_users_email', methods: ['POST'])]
    public function checkEmail(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (null === $email) {
            return $this->json(['message' => 'Email is missing: ' . $email], Response::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (null !== $user) {
            return $this->json(['message' => 'Email already exist'], Response::HTTP_CONFLICT);
        }

        return $this->json(['message' => 'OK'], Response::HTTP_OK);
    }


    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, MailerInterface $mailer, UrlGeneratorInterface $urlGenerator): Response
    {
        $data = json_decode($request->getContent(), true);

        // Vérifier que l'utilisateur n'existe pas déjà
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (null === $user) {
            $user = new User();
            $user->setEmail($data['email']);

            // Hachage du mot de passe
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            // Champs facultatifs
            $user->setFirstname($data['firstname'] ?? 'DefaultFirstname');
            $user->setLastname($data['lastname'] ?? 'DefaultLastname');
            $user->setUsername($data['username'] ?? 'DefaultUsername');

            // Génération du token de confirmation d'email
            $confirmationToken = Uuid::v4()->toRfc4122();
            $user->setEmaillink($confirmationToken);

            $entityManager->persist($user);
            $entityManager->flush();

            // Génération du lien de vérification
            $verificationLink = $urlGenerator->generate('app_confirm_email', [
                'emaillink' => $confirmationToken,
            ], UrlGeneratorInterface::ABSOLUTE_URL) . ".json"; 

            // Envoi de l'email de confirmation
            $email = (new Email())
                ->from('no-reply@example.com')
                ->to($user->getEmail())
                ->subject('Please Confirm your Email')
                ->html('<p>Please confirm your email by clicking on the following link: <a href="' . $verificationLink . '">Verify Email</a></p>');

            $mailer->send($email);

            return $this->json($user, Response::HTTP_CREATED);
        }

        return $this->json(['message' => 'User already exists'], Response::HTTP_CONFLICT);
    }

    public function __invoke(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, MailerInterface $mailer, UrlGeneratorInterface $urlGenerator): Response
    {
        return $this->register($request, $entityManager, $passwordHasher, $mailer, $urlGenerator);
    }

    #[Route('/verify-email/{emaillink}', name: 'app_confirm_email', methods: ['GET'])]
    public function verifyEmail(string $emaillink, EntityManagerInterface $entityManager): Response
    {
        $token = $emaillink;
        $token = rtrim($token, '.json');

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

    #[Route('/reset-password', name: 'app_reset_password', methods: ['POST'])]
    public function resetPassword(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, MailerInterface $mailer, UrlGeneratorInterface $urlGenerator): Response
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (null === $email) {
            return $this->json(['message' => 'Email is missing'], Response::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (null === $user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Génération du token de confirmation d'email
        $confirmationToken = Uuid::v4()->toRfc4122();
        $user->setEmaillink($confirmationToken);

        $entityManager->persist($user);
        $entityManager->flush();

        // Génération du lien de vérification
        $verificationLink = $urlGenerator->generate('app_confirm_email', [
            'emaillink' => $confirmationToken,
        ], UrlGeneratorInterface::ABSOLUTE_URL) . ".json"; 

        // Envoi de l'email de confirmation
        $email = (new Email())
            ->from('
}
