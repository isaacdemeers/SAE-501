<?php
namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class TokenExtractor
{
    public function extractTokenFromCookies(Request $request): ?string
    {
        // Récupérer les cookies contenant le JWT
        $headerPayloadCookieName = $request->cookies->get('jwt_header_payload_cookie');
        $signatureCookieName = $request->cookies->get('jwt_signature_cookie');

        if (!$headerPayloadCookieName || !$signatureCookieName) {
            throw new UnauthorizedHttpException('Invalid JWT token', 'JWT token not found');
        }

        // Récupérer les valeurs des cookies
        $headerPayload = $request->cookies->get($headerPayloadCookieName);
        $signature = $request->cookies->get($signatureCookieName);

        // Vérifier que les parties du JWT sont présentes
        if (empty($headerPayload) || empty($signature)) {
            throw new UnauthorizedHttpException('Invalid JWT token', 'JWT token parts missing');
        }

        // Reconstituer le JWT
        $jwt = $headerPayload . '.' . $signature;

        return $jwt;
    }
}
