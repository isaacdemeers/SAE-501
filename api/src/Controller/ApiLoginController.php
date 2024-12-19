<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class ApiLoginController implements AuthenticationSuccessHandlerInterface
{
    private $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): ?Response
    {
        
        $user = $token->getUser();
    
       
        $jwt = $this->jwtManager->create($user);
    
     
        if (substr_count($jwt, '.') !== 2) {
            throw new \Exception('Invalid JWT format');
        }
    
       
        [$header, $payload, $signature] = explode('.', $jwt);
    
     
        $headerPayloadCookie = new Cookie(
            '2af7273686d970a5404661e918a0439b316a0332fff65ce830dd52b9b46d333e',
            $header . '.' . $payload,
            time() + 43200,
            '/',
            null,
            true, // HttpOnly
            true,
            false,
            'lax'
        );
    
        $signatureCookie = new Cookie(
            '5756e9a6f92de5329d245b9d278f89c802d8db852de09ecdf26d66aefae4d7c0',
            $signature,
            time() + 43200,
            '/',
            null,
            true, // HttpOnly
            true,
            false,
            'lax'
        );
    
      
        $response = new JsonResponse([
            'message' => 'Authentication successful',
        ]);
    
       
        $response->headers->setCookie($headerPayloadCookie);
        $response->headers->setCookie($signatureCookie);
    
        return $response;
    }
}
