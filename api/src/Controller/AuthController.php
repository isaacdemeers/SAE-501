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
    public function validateToken(
        Request $request,
        JWTEncoderInterface $jwtEncoder,
        UserProviderInterface $userProvider,
        AmazonS3Service $s3Service
    ): JsonResponse {
        // Récupérer le token JWT depuis le cookie
        $token = $request->cookies->get('jwt_token');

        if (!$token) {
            return $this->json([
                'isValid' => false,
            ]);
        }

        try {
            // Décoder le token
            $payload = $jwtEncoder->decode($token);

            if (!$payload) {
                return $this->json([
                    'isValid' => false,
                ]);
            }

            // Vérifier que le token n'est pas expiré
            $currentTime = time();
            if ($payload['exp'] < $currentTime) {
                return $this->json([
                    'isValid' => false,
                ]);
            }

            $identifier = $payload['username'] ?? null;

            if (!$identifier) {
                return $this->json([
                    'isValid' => false,
                ]);
            }

            // Charger l'utilisateur à partir du UserProvider
            $user = $userProvider->loadUserByIdentifier($identifier);

            if (!$user || !$user instanceof User) {
                return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            // Préparer les données utilisateur
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
        } catch (\Exception $e) {
            return $this->json([
                'isValid' => false,
            ]);
        }
    }
}
