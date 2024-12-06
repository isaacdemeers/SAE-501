<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\AmazonS3Service;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;


class AuthController extends AbstractController
{

    private $s3Service;

    public function __construct(AmazonS3Service $s3Service)
    {
        $this->s3Service = $s3Service;
    }


    #[Route('/api/auth/validate-token', name: 'validate_token', methods: ['POST'])]
    public function validateToken(): JsonResponse {
        // Récupérer le token JWT depuis le cookie
       
        $user = $this->getUser();

        if (!$user) {
         return $this->json([
                'isValid' => false,
                ]);
        }

            $userData = [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstname(),
                'lastName' => $user->getLastname(),
            ];

            // Get the image URL from AWS S3
            $photoName = $user->getPhoto();
            if ($photoName) {
                $photoUrl = $this->s3Service->getObjectUrl($photoName);
                $userData['photo'] = $photoUrl;
            } else {
                $userData['photo'] = null;
            }

            // Répondre avec les informations utilisateur
            return $this->json(['isValid' => true, 'user' => $userData], JsonResponse::HTTP_OK);
        } 
    }

