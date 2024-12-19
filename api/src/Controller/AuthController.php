<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class AuthController extends AbstractController

{
    private $params;

    public function __construct(ParameterBagInterface $params)
    {
        $this->params = $params;
    }
    #[Route('/api/auth/validate-token', name: 'validate_token', methods: ['POST'])]
    public function validateToken(): JsonResponse {
       
        $user = $this->getUser();
        if (!$user) {
            return $this->json([
                'isValid' => false,
            ]);
        }
        $photo = $user->getPhoto();
        $link = $this->params->get('APP_URL') . '/assets/' . $photo;
        if (!$user) {
         return $this->json([
                'isValid' => false,
                ]);
        }

            $userData = [
                'id' => $user->getId(),
                'role' => $user->getRoles()[0],
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstname(),
                'lastName' => $user->getLastname(),
                'photo' => $link,
            ];

            
            return $this->json(['isValid' => true, 'user' => $userData], JsonResponse::HTTP_OK);
        } 
    }

