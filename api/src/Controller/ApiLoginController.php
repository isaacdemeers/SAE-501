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
        // Récupérer l'utilisateur connecté
        $user = $token->getUser();

        // Vérifier si l'utilisateur est valide et récupérer l'email et l'username
        $email = $user->getEmail();

        // Générer le token JWT avec l'email et l'username dans le payload
        $jwt = $this->jwtManager->createFromPayload($user, [
            'email' => $email,
        ]);

        // Créer un cookie pour le token JWT
        $cookie = new Cookie(
            'jwt_token', // Nom du cookie
            $jwt,        // Valeur du cookie (le token JWT)
            time() + 3600, // Expire dans 1 heure
            '/',         // Path : le cookie est accessible pour toute l'application
            null,         // Domaine : laisse par défaut pour le domaine actuel
            false,        // HTTPS (false pour dev)
            true,         // HttpOnly : rend le cookie inaccessible via JS
            false,        // SameSite : on peut ajuster selon les besoins (Strict/Lax)
            'lax'         // SameSite (lax est généralement plus permissif)
        );

        // Créer une réponse avec le cookie
        $response = new JsonResponse([
            'message' => 'Authentication successful',
            'email' => $email, // Vous pouvez également renvoyer l'email ici pour confirmation
        ]);

        // Ajouter le cookie à la réponse
        $response->headers->setCookie($cookie);

        return $response;
    }
}
