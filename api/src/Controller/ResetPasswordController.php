<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class ResetPasswordController extends AbstractController
{
   
#[Route('/reset/passwordemail', name: 'reset_passwordemail', methods: ['POST'])]
public function resetPasswordEmail(Request $request, EntityManagerInterface $entityManager, JWTTokenManagerInterface $JWTManager, MailerInterface $mailer): Response
{
    $data = json_decode($request->getContent(), true);
    $email = $data['email'] ?? null;

    // Vérification de l'email
    if (null === $email) {
        return $this->json(['message' => 'Email is missing'], Response::HTTP_BAD_REQUEST);
    }

    // Cherche l'utilisateur par email
    $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

    if (null === $user) {
        return $this->json(['message' => 'Email not found'], Response::HTTP_BAD_REQUEST);
    }

    // Génération du token JWT pour l'utilisateur avec l'email
    $token = $JWTManager->create($user);

    // Création du lien pour réinitialiser le mot de passe
    $resetLink = sprintf('https://scaling-disco-jj5v6vp6rg97hq64r-443.app.github.dev/resetpassword/%s', $token);

    // Envoi de l'email
    $emailMessage = (new Email())
        ->from('noreply@votredomaine.com')
        ->to($email)
        ->subject('Reset your password')
        ->html(sprintf('Click <a href="%s">here</a> to reset your password.', $resetLink));

    // Envoyer l'email
    try {
        $mailer->send($emailMessage);
    } catch (\Exception $e) {
        return $this->json(['message' => 'Failed to send email', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    return $this->json(['message' => 'Password reset email sent'], Response::HTTP_OK);
}

 #[Route('/reset/password', name: 'reset_password', methods: ['POST'])]
 public function resetPassword(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $JWTManager,): Response
 {
      // Décoder le token JWT pour obtenir l'utilisateur
    $data = json_decode($request->getContent(), true);
    $token = $data['token'] ?? null;

    if (null === $token) {
        return $this->json(['message' => 'Token is missing'], Response::HTTP_BAD_REQUEST);
    }
    try {
        $tokenData = $JWTManager->parse($token);
        $username = $tokenData['username'];
        
        // Vérifier si le token est expiré
        $expiration = $tokenData['exp'];
        if ($expiration < time()) {
            return $this->json(['message' => 'Token has expired'], Response::HTTP_BAD_REQUEST);
        }
    } catch (\Exception $e) {
        return $this->json(['message' => 'Invalid token'], Response::HTTP_BAD_REQUEST);
    }

    // Chercher l'utilisateur par le nom d'utilisateur
     $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

     if (null === $user) {
         return $this->json(['message' => 'User not found'], Response::HTTP_BAD_REQUEST);
     }

     $data = json_decode($request->getContent(), true);
     $password = $data['password'] ?? null;

     if (null === $password) {
         return $this->json(['message' => 'Password is missing'], Response::HTTP_BAD_REQUEST);
     }
    if (strlen($password) < 4) {
        return $this->json(['message' => 'Password must be at least 4 characters long'], Response::HTTP_BAD_REQUEST);
    }
     // Hachage du mot de passe
     $hashedPassword = $passwordHasher->hashPassword($user, $password);
     $user->setPassword($hashedPassword);

     // Sauvegarde de l'utilisateur
     $entityManager->persist($user);
     $entityManager->flush();

     return $this->json(['message' => 'Password reset'], Response::HTTP_OK);
 }
}
