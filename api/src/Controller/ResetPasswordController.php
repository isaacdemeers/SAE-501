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
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ResetPasswordController extends AbstractController
{
    private $params;

    public function __construct(ParameterBagInterface $params)
    {
        $this->params = $params;
    }

    #[Route('/reset/passwordemail', name: 'reset_passwordemail', methods: ['POST'])]
    public function resetPasswordEmail(Request $request, EntityManagerInterface $entityManager, JWTTokenManagerInterface $JWTManager, MailerInterface $mailer): Response
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

      
        if (null === $email) {
            return $this->json(['message' => 'Email is missing'], Response::HTTP_BAD_REQUEST);
        }

   
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (null === $user) {
            return $this->json(['message' => 'Email not found'], Response::HTTP_BAD_REQUEST);
        }

       
        $token = $JWTManager->create($user);

        
        $user->setTokenPassword($token);
        $entityManager->persist($user);
        $entityManager->flush();

       
        $appUrl = rtrim($this->params->get('APP_URL'), '/');
        $resetLink = sprintf('%s/resetpassword/%s', $appUrl, $token);

      
        $emailMessage = (new Email())
            ->from('noreply@votredomaine.com')
            ->to($email)
            ->subject('Réinitialisation du mot de passe')
            ->html(
                $this->renderView(
                    'email/email_reset.html.twig',
                    ['resetLink' => $resetLink,
                    'APP_URL' => $appUrl]
                )
                );

     
        try {
            $mailer->send($emailMessage);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Failed to send email', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['message' => 'Password reset email sent'], Response::HTTP_OK);
    }

    #[Route('/reset/password', name: 'reset_password', methods: ['POST'])]
    public function resetPassword(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $JWTManager): Response
    {
        
        $data = json_decode($request->getContent(), true);
        $token = $data['token'] ?? null;

        if (null === $token) {
            return $this->json(['message' => 'Token is missing'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $tokenData = $JWTManager->parse($token);
            $username = $tokenData['username'];
            
           
            $expiration = $tokenData['exp'];
            if ($expiration < time()) {
                return $this->json(['message' => 'Token has expired'], Response::HTTP_BAD_REQUEST);
            }
        } catch (\Exception $e) {
            return $this->json(['message' => 'Invalid token'], Response::HTTP_BAD_REQUEST);
        }

        
        $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (null === $user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_BAD_REQUEST);
        }

      
        if ($user->getTokenPassword() !== $token) {
            return $this->json(['message' => 'Invalid token'], Response::HTTP_BAD_REQUEST);
        }

        $password = $data['password'] ?? null;

        if (null === $password) {
            return $this->json(['message' => 'Password is missing'], Response::HTTP_BAD_REQUEST);
        }

        if (strlen($password) < 4) {
            return $this->json(['message' => 'Password must be at least 4 characters long'], Response::HTTP_BAD_REQUEST);
        }

       
        $hashedPassword = $passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

      
        $user->setTokenPassword(null);


        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'Password reset'], Response::HTTP_OK);
    }
}
