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
use App\Repository\UserRepository;

class EventController extends AbstractController
{
 private $s3Service;
 
 public function __construct(AmazonS3Service $s3Service)
 {
    $this->s3Service = $s3Service;
 }
 

 #[Route('/event/create', name: 'app_event_create', methods: ['POST'])]
 public function createEvent(Request $request, EntityManagerInterface $entityManager , MailerInterface $mailer,JWTEncoderInterface $jwtEncoder , UserProviderInterface $userProvider ): JsonResponse
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

    $shareLink = 'https://example.com/event/
    1' . $event->getId();

    $event->setSharelink($shareLink);
    $entityManager->persist($event);
    $entityManager->flush();
    foreach ($invitees as $invitee) {
        if (filter_var($invitee, FILTER_VALIDATE_EMAIL)) {
            $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $invitee]);

            if (!$user) {
            // Create a new user with ROLE_INVITE
            $user = new User();
            $user->setEmail($invitee);
            $user->setPassword('12345'); // Set a default password or generate a random one
            $user->setPhoto('default.jpg');
            $user->setRoles(['ROLE_INVITE']);
            $user->setCreatedAt(new \DateTimeImmutable());
            $entityManager->persist($user);
            $entityManager->flush();
            }

            // Create a new UserInvitation
            $uuid = UuidV4::v4();
            $link = 'https://example.com/event/' . $event->getId() . ($event->getVisibility() ? '?connection=' : '?newconnection=') . $uuid;

            $userInvitation = new UserInvitation();
            $userInvitation->setEvent($event);
            $userInvitation->setUserId($user);
            $userInvitation->setDateInvitation(new \DateTime());
            $userInvitation->setLink($link);
            $userInvitation->setExpiration($event->getDateend());
            $entityManager->persist($userInvitation);
            $entityManager->flush();

            // Send invitation email
            $emailContent = '<p>You have been invited to the event: ' . $event->getTitle() . '</p><p>Event details: <a href="' . $shareLink . '">Event Detail</a></p>';
            if ($event->getVisibility() === 0) {
            $emailContent .= '<p>This is a private event. You need to have or create an account with the email that received this link.</p>';
            }
            $emailContent .= '<p>To join the event, please click on the following link: <a href="' . $link . '">Join Event</a></p>';

            $email = (new Email())
            ->from('no-reply@example.com')
            ->to($invitee)
            ->subject('You are invited to an event')
            ->html($emailContent);

            $mailer->send($email);
        }
    }
 

// Retrieve the token from the request cookies
$token = $request->cookies->get('jwt_token');

if (!$token) {
    return new JsonResponse(['error' => 'Token is missing'], Response::HTTP_UNAUTHORIZED);
}

try {
    // Decode the token
    $payload = $jwtEncoder->decode($token);

    if (!$payload) {
        return new JsonResponse(['error' => 'Invalid token'], Response::HTTP_UNAUTHORIZED);
    }

    // Check if the token is expired
    $currentTime = time();
    if ($payload['exp'] < $currentTime) {
        return new JsonResponse(['error' => 'Token has expired'], Response::HTTP_UNAUTHORIZED);
    }

    // Get the identifier from the token payload
    $identifier = $payload['email'] ?? null;

    if (!$identifier) {
        return new JsonResponse(['error' => 'Identifier not found in token'], Response::HTTP_BAD_REQUEST);
    }

    // Load the user from the UserProvider
    $user = $userProvider->loadUserByIdentifier($identifier);

    if (!$user) {
        return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
    }

    // Create a new UserEvent with the role ROLE_ADMIN
    $userEvent = new UserEvent();
    $userEvent->setEvent($event);
    $userEvent->setUser($user);
    $userEvent->setRole('ROLE_ADMIN');
    $entityManager->persist($userEvent);
    $entityManager->flush();

} catch (\Exception $e) {
    return new JsonResponse(['error' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
}



    return new JsonResponse([
        'message' => 'Event created successfully',
    ], Response::HTTP_CREATED);
 }



#[Route('/event/{event}/join', name: 'app_event_join', methods: ['POST'])]
public function joinEvent(
    Request $request,
    EventRepository $eventRepository,
    UserRepository $userRepository,
    JWTEncoderInterface $jwtEncoder,
    UserProviderInterface $userProvider,
    EntityManagerInterface $entityManager,
    MailerInterface $mailer
): JsonResponse {
    // Récupérer le token JWT depuis le cookie
    $token = $request->cookies->get('jwt_token');

    if (empty($token)) {
        $email = $request->get('email');
        if (!$email) {
            return $this->json(['error' => 'Email is missing'], Response::HTTP_BAD_REQUEST);
        }
        $user = $userRepository->findOneBy(['email'=> $email]);
        if ($user) {
            if (in_array("ROLE_USER", $user->getRoles())) {
                return $this->json(['error' => 'Account exists with this email, please log in'], Response::HTTP_BAD_REQUEST);
            }
            try {
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
        $emailInvitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
            'event' => $event,
            'user_id' => $user
        ]);

        if ($emailInvitation) {
            $uuid = UuidV4::v4();
            $link = 'https://example.com/event/' . $event->getId() . '?connection=' . $uuid;
            $emailInvitation->setLink($link);
            $emailInvitation->setDateInvitation(new \DateTime());
            $entityManager->flush();

            $email = (new Email())
                ->from('noreply@exemple.fr')
                ->to($user->getEmail())
                ->subject('You have joined an event')
                ->html('<p>You have successfully joined the event: ' . $event->getTitle() .  '  <p>To join the event, please click on the following link: <a href="' . $link . '">Join Event</a>' );

            $mailer->send($email);

            return $this->json([
                'message' => 'User successfully joined the event',
            ], Response::HTTP_OK);
        }
    }

        // Ajouter l'utilisateur à l'événement
        $userEvent = new UserEvent();
        $userEvent->setEvent($event);
        $userEvent->setUser($user);
        $userEvent->setRole('ROLE_USER');
        $entityManager->persist($userEvent);
        $entityManager->flush();

        $uuid = UuidV4::v4();
        $link = 'https://example.com/event/' . $event->getId() . '?newconnection=' . $uuid;

        $EmailInvitation = new UserInvitation();
        $EmailInvitation->setEvent($event);
        $EmailInvitation->setUserId($user);
        $EmailInvitation->setDateInvitation(new \DateTime());
        $EmailInvitation->setLink($link);
        $EmailInvitation->setExpiration($event->getDateend());
        $entityManager->persist($EmailInvitation);
        $entityManager->flush();

        $email = (new Email())
            ->from('noreply@exemple.fr')
            ->to($user->getEmail())
            ->subject('You have joined an event')
            ->html('<p>You have successfully joined the event: ' . $event->getTitle() .  '  <p>To join the event, please click on the following link: <a href="' . $link . '">Join Event</a>' );
           
            $mailer->send($email);
        return $this->json([
            'message' => 'User successfully joined the event',
        ], Response::HTTP_OK);
    } catch (\Exception $e) {
        return $this->json(['error' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
else{
    "créer un utilisateur dans la table user avec le role ROLE_INVITE";
$user = new User();
$user->setEmail($email);
$user->setPassword('12345');
$user->setPhoto('default.jpg');
$user->setRoles(['ROLE_INVITE']);
$user->setCreatedAt(new \DateTimeImmutable());
$entityManager->persist($user);
$entityManager->flush();

// Execute the rest of the function
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
$entityManager->persist($userEvent);
$entityManager->flush();

$uuid = UuidV4::v4();
$link = 'https://example.com/event/' . $event->getId() . '?connection=' . $uuid;

$EmailInvitation = new UserInvitation();
$EmailInvitation->setEvent($event);
$EmailInvitation->setUserId($user);
$EmailInvitation->setDateInvitation(new \DateTime());
$EmailInvitation->setLink($link);
$EmailInvitation->setExpiration($event->getDateend());
  $entityManager->persist($EmailInvitation);
        $entityManager->flush();

$email = (new Email())
    ->from('noreply@exemple.fr')
    ->to($user->getEmail())
    ->subject('You have joined an event')
    ->html('<p>You have successfully joined the event: ' . $event->getTitle() .  '  <p>To join the event, please click on the following link: <a href="' . $link . '">Join Event</a>' );

$mailer->send($email);

return $this->json([
    'message' => 'User successfully joined the event',
], Response::HTTP_OK);
}
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
        'visibility' => $event->getVisibility(),
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
                ->setParameter('visibility', 1) // 1 means public
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
                ->setParameter('visibility', 1);

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
                    'sharelink' => $event->getSharelink(),
                    'isPublic' => $event->getVisibility()
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

            $role =  $userEvent->getRole();
            return new JsonResponse(['isLog' => true, 'Role' => $role], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['isLog' => false, 'error' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }



    #[Route('/userevents/{event}/new-connection-uuid', name: 'get_event_newusers_invited', methods: ['POST'])]
    public function newConnectionUuid($event, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $uuid = $data['uuid'] ?? null;
        // Retrieve the invitation by UUID
        $invitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
            'event' => $event,
            'link' => 'https://example.com/event/' . $event . '?connection=' . $uuid
        ]);

        if ($invitation) {
            $userId = $invitation->getUserId();

            // Check if the user is in the UserEvent table
            $userEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
            'event' => $event,
            'user' => $userId
            ]);

            if ($userEvent) {
            return new JsonResponse(['isValid' => true], Response::HTTP_OK);
            } else {
            // Mark the UUID as used
            $invitation->setDateAcceptinvitation(new \DateTime());
            $entityManager->flush();

            $event = $entityManager->getRepository(Event::class)->find($event);
            // Add the user to the event
            $userEvent = new UserEvent();
            $userEvent->setEvent($event);
            $userEvent->setUser($userId);
            $userEvent->setRole('ROLE_USER');
            $entityManager->persist($userEvent);
            $entityManager->flush();

            return new JsonResponse(['isValid' => true, 'message' => 'User successfully added to the event'], Response::HTTP_OK);
            }
        } else {
            return new JsonResponse(['isValid' => false, 'error' => 'Invalid UUID'], Response::HTTP_BAD_REQUEST);
        }
    }





    #[Route('/userevents/{event}/verify-connection-uuid', name: 'get_event_users_invited', methods: ['POST'])]
    public function verifyConnectionUuid($event, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $uuid = $data['uuid'] ?? null;
        // Retrieve the invitation by UUID
        $invitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
            'event' => $event,
            'link' => 'https://example.com/event/' . $event . '?connection=' . $uuid
        ]);

        if ($invitation) {
            $userId = $invitation->getUserId();

            // Check if the user is in the UserEvent table
            $userEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
                'event' => $event,
                'user' => $userId
            ]);

            if ($userEvent) {
                return new JsonResponse(['isValid' => true], Response::HTTP_OK);
            } else {
                return new JsonResponse(['isValid' => false, 'error' => 'User not found in UserEvent'], Response::HTTP_BAD_REQUEST);
            }
        } else {
            return new JsonResponse(['isValid' => false, 'error' => 'Invalid UUID'], Response::HTTP_BAD_REQUEST);
        }
    }


     #[Route('/userevents/{event}/leave', name: 'app_event_leave', methods: ['POST'])]
     public function LeaveEventConnecteduser($event, EntityManagerInterface $entityManager ,Request $request , JWTEncoderInterface $jwtEncoder , UserProviderInterface $userProvider): JsonResponse
    {
        // Retrieve the token from the request cookies
        $token = $request->cookies->get('jwt_token');

        if (!$token) {

            $data = json_decode($request->getContent(), true);
            $uuid = $data['uuid'] ?? null;
            if (!$uuid) {
                return new JsonResponse(['error' => 'UUID is missing'], Response::HTTP_BAD_REQUEST);
            }

            $event = $entityManager->getRepository(Event::class)->find($event);
            // Verify if the UUID exists in the UserInvitation table
            $userInvitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
                'event' => $event,
                'link' => 'https://example.com/event/' . $event->getId() . '?connection=' . $uuid
            ]);

            if (!$userInvitation) {
                return new JsonResponse(['error' => 'Invalid UUID or invitation not found'], Response::HTTP_BAD_REQUEST);
            }

            $userid = $userInvitation->getUserId();

            $User = $entityManager->getRepository(User::class)->find($userid);
            if (!$User) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }
            
            // Check if the user has the role 'ROLE_ADMIN'
            $userEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
                'event' => $event,
                'user' => $User
            ]);

            // Remove the user from the UserEvent table
            if ($userEvent) {
                $entityManager->remove($userEvent);
            }

            // Remove the user from the UserInvitation table if exists
            $userInvitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
                'event' => $event,
                'user_id' => $User
            ]);

            if ($userInvitation) {
                $entityManager->remove($userInvitation);
            }

            $entityManager->flush();

            return new JsonResponse(['message' => 'User successfully left the event'], Response::HTTP_OK);

        }

        try {
            // Decode the token
            $payload = $jwtEncoder->decode($token);

            if (!$payload) {
                return new JsonResponse(['error' => 'Invalid token'], Response::HTTP_UNAUTHORIZED);
            }

            // Check if the token is expired
            $currentTime = time();
            if ($payload['exp'] < $currentTime) {
                return new JsonResponse(['error' => 'Token has expired'], Response::HTTP_UNAUTHORIZED);
            }

            // Get the identifier from the token payload
            $identifier = $payload['email'] ?? null;

            if (!$identifier) {
                return new JsonResponse(['error' => 'Identifier not found in token'], Response::HTTP_BAD_REQUEST);
            }

            // Load the user from the UserProvider
            $user = $userProvider->loadUserByIdentifier($identifier);

            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            // Retrieve the event
            $event = $entityManager->getRepository(Event::class)->find($event);
            // Check if the user has the role 'ROLE_ADMIN'
            $userEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
                'event' => $event,
                'user' => $user
            ]);

            if ($userEvent && $userEvent->getRole() === 'ROLE_ADMIN') {
                return new JsonResponse(['error' => 'Admin users cannot unsubscribe from the event'], Response::HTTP_FORBIDDEN);
            }

            // Remove the user from the UserEvent table
            if ($userEvent) {
                $entityManager->remove($userEvent);
            }
        

            if ($userEvent) {
                $entityManager->remove($userEvent);
            }

            // Remove the user from the UserInvitation table if exists
            $userInvitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
                'event' => $event,
                'user_id' => $user
            ]);

            if ($userInvitation) {
                $entityManager->remove($userInvitation);
            }

            $entityManager->flush();

            return new JsonResponse(['message' => 'User successfully left the event'], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }



}