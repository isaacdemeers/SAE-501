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
        
        
        $response->headers->clearCookie('2af7273686d970a5404661e918a0439b316a0332fff65ce830dd52b9b46d333e', 
            path: '/', 
            domain: null,
            secure: true,
            httpOnly: true,
            sameSite: Cookie::SAMESITE_STRICT
        );
        
        $response->headers->clearCookie('5756e9a6f92de5329d245b9d278f89c802d8db852de09ecdf26d66aefae4d7c0', 
        path: '/', 
        domain: null,
        secure: true,
        httpOnly: true,
        sameSite: Cookie::SAMESITE_STRICT
    );
        return $response;
    }
} 