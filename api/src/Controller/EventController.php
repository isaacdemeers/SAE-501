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
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use App\Entity\EventUser;
use App\Entity\User;
use App\Entity\UserEvent;
use App\Entity\UserInvitation;
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
    $event->setCreatedAt(new \DateTimeImmutable());
    $event->setVisibility($data['visibility'] === 'public' ? 1 : 0);
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
    EntityManagerInterface $entityManager,
    MailerInterface $mailer
): JsonResponse {
    // Récupérer le token JWT depuis le cookie
    $token = $request->cookies->get('jwt_token');

    if (!$token) {
        $email = $request->get('email');
        if(!$email) {
            return $this->json(['error' => 'Email or Token is missing'], Response::HTTP_UNAUTHORIZED);
        }

    $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

    if ($user) {
        return $this->json(['message' => 'Cette adresse mail est lier a un compte veuillez vous connectez pour vous inscrire'], Response::HTTP_NOT_FOUND);
    }
    $event = $eventRepository->find($request->get('event'));

    $userEvent = new UserEvent();
    $userEvent->setEvent($event);
    $userEvent->setUser(null);
    $userEvent->setRole('ROLE_USER');
    $userEvent->setUserEmail(userEmail: $email);

    $entityManager->persist($userEvent);
    $entityManager->flush();

    $uuid = UuidV4::v4();
    $invitation = new UserInvitation();
    $invitation->setLink($uuid);
    $invitation->setEmail($email);
    $invitation->setEvent($event);
    $invitation->setExpiration($event->getDateend());

    $entityManager->persist($invitation);
    $entityManager->flush();

    $link = 'http://localhost/events/' . $event->getId() . '?connection=' . $uuid;

    $email = (new Email())
        ->from('no-reply@example.com')
        ->to($email)
        ->subject('You are invited to an event')
        ->html('<p>You have join the event: ' . $event->getTitle() . '</p><p>Event details: ' . $link . '</p>');

    try {
        $mailer->send($email);
    } catch (\Exception $e) {
        return $this->json(['error' => 'Failed to send email: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    $entityManager->persist($userEvent);
    $entityManager->flush();

    return $this->json([
        'message' => 'User successfully joined the event',
        'link' => $link,
    ], Response::HTTP_OK);
    }
    try {
        // Décoder le token
        $payload = $jwtEncoder->decode($token);

        if (!$payload) {
            return $this->json(['error' => 'Invalid token'], Response::HTTP_UNAUTHORIZED);
        }

        // Vérifier que le token n'est pas expiré
        $currentTime = time();
        if ($payload['exp'] < $currentTime) {
            return $this->json(['error' => 'Token has expired'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupérer le username ou identifiant depuis le payload
        $identifier = $payload['email'] ?? null;

        if (!$identifier) {
            return $this->json(['error' => 'Identifier not found in token'], Response::HTTP_BAD_REQUEST);
        }

        // Charger l'utilisateur à partir du UserProvider
        $user = $userProvider->loadUserByIdentifier($identifier);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer l'événement
        $event = $eventRepository->find($request->get('event'));

        if (!$event) {
            return $this->json(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier si l'utilisateur est déjà inscrit à l'événement
        $existingUserEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
            'event' => $event,
            'user' => $user
        ]);

        if ($existingUserEvent) {
            return $this->json(['error' => 'User is already joined to the event'], Response::HTTP_BAD_REQUEST);
        }

        // Ajouter l'utilisateur à l'événement
        $userEvent = new UserEvent();
        $userEvent->setEvent($event);
        $userEvent->setUser($user);
        $userEvent->setRole('ROLE_USER');
        $userEvent->setUserEmail(null);

        $entityManager->persist($userEvent);
        $entityManager->flush();

        return $this->json([
            'message' => 'User successfully joined the event',
        ], Response::HTTP_OK);
    } catch (\Exception $e) {
        return $this->json(['error' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}


#[Route('/event/{id}', name: 'app_event_get', methods: ['POST'])]
public function getevent (Request $request, EventRepository $eventRepository): JsonResponse
{
    $event = $eventRepository->find($request->get('id'));
    if (!$event) {
        return $this->json(['error'=> 'Event not found'], Response::HTTP_NOT_FOUND);
    }

    $eventData = [
        'id' => $event->getId(),
        'title' => $event->getTitle(),
        'description' => $event->getDescription(),
        'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
        'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
        'location' => $event->getLocation(),
        'maxparticipant' => $event->getMaxparticipant(),
        'visibility' => $event->isVisibility(),
        'sharelink' => $event->getSharelink(),
    ];

    // Get the image URL from AWS S3
    $imageName = $event->getImg();
    if ($imageName) {
        $imageUrl = $this->s3Service->getObjectUrl($imageName);
        $eventData['img'] = $imageUrl;
    } else {
        $eventData['img'] = null;
    }

    return $this->json($eventData, JsonResponse::HTTP_OK);
}

#[Route('/api/events/upcoming', name: 'get_upcoming_events', methods: ['GET'])]
    public function getUpcomingEvents(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $currentDate = new \DateTime();

            // Get the page number from query parameters, default to 1 if not provided
            $page = $request->query->getInt('page', 1);
            $limit = 10; // Number of events per page
            $offset = ($page - 1) * $limit;

            // Create query builder
            $queryBuilder = $entityManager->createQueryBuilder();
            $queryBuilder
                ->select('e')
                ->from(Event::class, 'e')
                ->where('e.datestart > :currentDate')
                ->andWhere('e.visibility = :visibility')
                ->setParameter('currentDate', $currentDate)
                ->setParameter('visibility', true) // Assuming true means public
                ->orderBy('e.datestart', 'ASC')
                ->setMaxResults($limit)
                ->setFirstResult($offset);

            $events = $queryBuilder->getQuery()->getResult();

           
            // Get total count for pagination
            $totalQueryBuilder = $entityManager->createQueryBuilder();
            $totalQueryBuilder
                ->select('COUNT(e)')
                ->from(Event::class, 'e')
                ->where('e.datestart > :currentDate')
                ->andWhere('e.visibility = :visibility')
                ->setParameter('currentDate', $currentDate)
                ->setParameter('visibility', true);

            $totalEvents = $totalQueryBuilder->getQuery()->getSingleScalarResult();


            // Format the events for the response
            $formattedEvents = [];
            foreach ($events as $event) {
                $imageName = $event->getImg();
                $imageUrl = $this->s3Service->getObjectUrl($imageName);
                
                $formattedEvents[] = [
                    'id' => $event->getId(),
                    'title' => $event->getTitle(),
                    'description' => $event->getDescription(),
                    'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
                    'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
                    'location' => $event->getLocation(),
                    'maxparticipant' => $event->getMaxparticipant(),
                    'img' => $imageUrl,
                    'sharelink' => $event->getSharelink()
                ];
            }

            return new JsonResponse([
                'events' => $formattedEvents,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => ceil($totalEvents / $limit),
                    'total_events' => $totalEvents,
                    'events_per_page' => $limit
                ]
            ]);

        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => 'An error occurred while fetching events',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/events', name: 'get_all_events', methods: ['GET'])]
    public function getAllEvents(EventRepository $eventRepository): JsonResponse
    {
        $events = $eventRepository->findAll();

        $formattedEvents = [];
        foreach ($events as $event) {
            $imageName = $event->getImg();
            $imageUrl = $this->s3Service->getObjectUrl($imageName);

            $formattedEvents[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
                'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'maxparticipant' => $event->getMaxparticipant(),
                'img' => $imageUrl,
                'sharelink' => $event->getSharelink()
            ];
        }

        return new JsonResponse($formattedEvents, JsonResponse::HTTP_OK);
    }



    #[Route('/userevents/{eventid}', name: 'get_event_users', methods: ['GET'])]
    public function getEventUsers($eventid, Request $request, EntityManagerInterface $entityManager, JWTEncoderInterface $jwtEncoder, UserProviderInterface $userProvider): JsonResponse
    {
        // Récupérer le token JWT depuis le cookie
        $token = $request->cookies->get('jwt_token');

        if (!$token) {
            return new JsonResponse(['isLog' => false, 'error' => 'Token is missing'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            // Décoder le token
            $payload = $jwtEncoder->decode($token);

            if (!$payload) {
                return new JsonResponse(['isLog' => false, 'error' => 'Invalid token'], Response::HTTP_UNAUTHORIZED);
            }

            // Vérifier que le token n'est pas expiré
            $currentTime = time();
            if ($payload['exp'] < $currentTime) {
                return new JsonResponse(['isLog' => false, 'error' => 'Token has expired'], Response::HTTP_UNAUTHORIZED);
            }

            // Récupérer le username ou identifiant depuis le payload
            $identifier = $payload['email'] ?? null;

            if (!$identifier) {
                return new JsonResponse(['isLog' => false, 'error' => 'Identifier not found in token'], Response::HTTP_BAD_REQUEST);
            }

            // Charger l'utilisateur à partir du UserProvider
            $user = $userProvider->loadUserByIdentifier($identifier);

            if (!$user) {
                return new JsonResponse(['isLog' => false, 'error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            // Récupérer l'événement
            $event = $entityManager->getRepository(Event::class)->find($eventid);

            if (!$event) {
                return new JsonResponse(['isLog' => true, 'error' => 'Event not found'], Response::HTTP_NOT_FOUND);
            }

            // Vérifier si l'utilisateur est inscrit à l'événement
            $userEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
                'event' => $event,
                'user' => $user
            ]);

            if (!$userEvent) {
                return new JsonResponse(['isLog' => false, 'message' => 'User is not joined to the event'], Response::HTTP_BAD_REQUEST);
            }

            // Récupérer tous les utilisateurs inscrits à l'événement
            $userEvents = $entityManager->getRepository(UserEvent::class)->findBy(['event' => $event]);

            $users = [];
            foreach ($userEvents as $userEvent) {
                $users[] = [
                    'role' => $userEvent->getRole(),
                ];
            }

            return new JsonResponse(['isLog' => true, 'users' => $users], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['isLog' => false, 'error' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}