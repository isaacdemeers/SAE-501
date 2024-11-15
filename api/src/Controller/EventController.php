<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Event;
use App\Service\AmazonS3Service;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Uid\UuidV4;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use App\Entity\EventUser;
use App\Repository\EventRepository;

class EventController extends AbstractController
{
 private $s3Service;
 
 public function __construct(AmazonS3Service $s3Service)
 {
    $this->s3Service = $s3Service;
 }
 

 #[Route('/event/create', name: 'app_event_create', methods: ['POST'])]
 public function createEvent(Request $request, EntityManagerInterface $entityManager , MailerInterface $mailer, ): JsonResponse
 {
    // Set the maximum file size to 10MB
    $maxFileSize = 8 * 1024 * 1024; // 10MB in bytes

    $data = $request->request->all();
    
    if (empty($data['title']) || empty($data['description']) || empty($data['datestart']) || empty($data['dateend']) || empty($data['location']) || !isset($data['visibility'])) {
        return new JsonResponse([
           'message' => 'Missing required fields.',
           'data' => $data
        ], Response::HTTP_BAD_REQUEST);
    }
    
    $file = $request->files->get('img');
    
    if ($file && $file->getSize() > $maxFileSize) {
        return new JsonResponse(['message' => 'File size exceeds the maximum limit of 10MB.'], Response::HTTP_BAD_REQUEST);
    }
 
    $event = new Event();
    $event->setTitle($data['title']);
    $event->setDescription($data['description']);
    $event->setDatestart(new \DateTime($data['datestart']));
    $event->setDateend(new \DateTime($data['dateend']));
    $event->setLocation($data['location']);
    if($data['maxparticipant'] == null){
        $data['maxparticipant'] = 0;
    }
    $event->setMaxparticipant($data['maxparticipant']);
    $event->setVisibility($data['visibility']);
    if ($file) {
        $imageName = uniqid() . '.' . $file->guessExtension();
        $uploaded = $this->s3Service->uploadObject($imageName, $file->getPathname());
        if ($uploaded) {
           $event->setImg($imageName);
        } else {
           return new JsonResponse(['message' => 'Failed to upload image to S3.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    else {
        $event->setImg('event-background-desktop.png');
    }
 
    $invitees = json_decode($data['invitees'], true);

    $shareLink = 'https://example.com/event/invite/
    1' . $event->getId();

    $event->setSharelink($shareLink);

    if (!empty($invitees) && is_array($invitees)) {
        foreach ($invitees as $invitee) {
            if (filter_var($invitee, FILTER_VALIDATE_EMAIL)) {
                $email = (new Email())
                    ->from('no-reply@example.com')
                    ->to($invitee)
                    ->subject('You are invited to an event')
                    ->html('<p>You have been invited to the event: ' . $event->getTitle() . '</p><p>Event details: ' . $shareLink . '</p>');

                $mailer->send($email);
            }
        }
    }


    $entityManager->persist($event);
    $entityManager->flush();
 
    return new JsonResponse([
        'message' => 'Event created successfully',
    ], Response::HTTP_CREATED);
 }

#[Route('/event/{event}/join', name: 'app_event_join', methods: ['POST'])]
public function joinEvent(
    Request $request,
    EventRepository $eventRepository,
    JWTEncoderInterface $jwtEncoder,
    UserProviderInterface $userProvider,
    EntityManagerInterface $entityManager
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
        $identifier = $payload['email'] ?? null;

        if (!$identifier) {
            return $this->json(['error' => 'Identifier not found in token'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Charger l'utilisateur à partir du UserProvider
        $user = $userProvider->loadUserByIdentifier($identifier);

        if (!$user) {
            return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Récupérer l'événement
        $event = $eventRepository->find($request->get('event'));

        if (!$event) {
            return $this->json(['error' => 'Event not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Ajouter l'utilisateur à l'événement
        $eventUser = new EventUser();
        $eventUser->setEvent($event);
        $eventUser->setUserId($user);
        $eventUser->setRole('ROLE_USER');

        $entityManager->persist($eventUser);
        $entityManager->flush();

        return $this->json(['message' => 'User successfully joined the event'], JsonResponse::HTTP_OK);
    } catch (\Exception $e) {
        return $this->json(['error' => 'An error occurred: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
    }
}
}