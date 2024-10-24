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
        // Générer le token JWT
        $jwt = $this->jwtManager->create($token->getUser());

        // Créer un cookie pour le token JWT
        $cookie = new Cookie(
            'jwt_token',
            $jwt,
            time() + 3600, // Expire dans 1 heure
            '/',
            null,
            false, // True si HTTPS, False pour dev
            true,  // HttpOnly, inaccessible depuis JS
            false, // SameSite Lax ou Strict
            'lax'  // Pour éviter les envois intersites
        );

        // Créer une réponse avec le cookie
        $response = new JsonResponse([
            'message' => 'Authentication successful',
        ]);

        // Ajouter le cookie à la réponse
        $response->headers->setCookie($cookie);

        return $response;
    }
}
