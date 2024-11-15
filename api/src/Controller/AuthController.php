<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use App\Service\AmazonS3Service;

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
        UserProviderInterface $userProvider
    ): JsonResponse {
        // Récupérer le token JWT depuis le cookie
        $token = $request->cookies->get('jwt_token');

        if (!$token) {
            return $this->json(['error' => 'Token is missing'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        try {
            // Décoder le token
            $payload = $jwtEncoder->decode($token);

            if (!$payload) {
                return $this->json(['error' => 'Invalid token'], JsonResponse::HTTP_UNAUTHORIZED);
            }

            // Vérifier que le token n'est pas expiré
            $currentTime = time();
            if ($payload['exp'] < $currentTime) {
                return $this->json(['error' => 'Token has expired'], JsonResponse::HTTP_UNAUTHORIZED);
            }

            // Récupérer le username ou identifiant depuis le payload
            $identifier = $payload['email'] ?? null; // ou remplacez 'username' par l'identifiant utilisé dans vos tokens

            if (!$identifier) {
                return $this->json(['error' => 'Identifier not found in token'], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Charger l'utilisateur à partir du UserProvider
                $user = $userProvider->loadUserByIdentifier($identifier);

            if (!$user) {
                return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            // Obtenir l'URL de l'image via AmazonS3Service
            $imageName = $user->getPhoto();
            $imageUrl = $imageName ? $this->s3Service->getObjectUrl($imageName) : null;

            // Répondre avec les informations utilisateur
            return $this->json([
                'isValid' => true,
                'user' => [
                    'id' => $user->getId(),
                    'username' => $user->getUsername(),
                    'email' => $user->getEmail(),
                    'image' => $imageUrl,
                ],
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'An error occurred: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
