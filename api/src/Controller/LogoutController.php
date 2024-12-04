<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Cookie;

class LogoutController extends AbstractController
{
    #[Route('/api/auth/logout', name: 'app_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        $response = new JsonResponse(['message' => 'Logged out successfully']);
        
        // Supprime le cookie JWT avec tous les paramètres nécessaires
        $response->headers->clearCookie('jwt_token', 
            path: '/', 
            domain: null,
            secure: true,
            httpOnly: true,
            sameSite: Cookie::SAMESITE_STRICT
        );
        
        // Force l'expiration immédiate du cookie
        $response->headers->setCookie(
            new Cookie(
                'jwt',
                '',
                time() - 3600,  // Expire dans le passé
                '/',
                null,
                true,
                true,
                false,
                Cookie::SAMESITE_STRICT
            )
        );
        
        return $response;
    }
} 