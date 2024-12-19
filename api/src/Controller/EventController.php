<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
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
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserEventRepository;

class EventController extends AbstractController
{
    private $params;

    public function __construct( ParameterBagInterface $params)
    {
        $this->params = $params;
    }


    #[Route('/event/create', name: 'app_event_create', methods: ['POST'])]
    public function createEvent(Request $request, EntityManagerInterface $entityManager, MailerInterface $mailer, JWTEncoderInterface $jwtEncoder, UserProviderInterface $userProvider): JsonResponse
    {
       
        $maxFileSize = 8 * 1024 * 1024; 

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
        $event->setDatestart((new \DateTime($data['datestart']))->modify('+1 hour'));
        $event->setDateend((new \DateTime($data['dateend']))->modify('+1 hour'));
        $event->setLocation($data['location']);
        if ($data['maxparticipant'] == null) {
            $data['maxparticipant'] = 0;
        }
        $event->setMaxparticipant($data['maxparticipant']);
        $event->setCreatedAt(new \DateTimeImmutable());
        $event->setVisibility($data['visibility'] === 'public' ? 1 : 0);
        if ($file) {
            $imageName = uniqid() . '.' . $file->guessExtension();
            $file->move($this->getParameter('kernel.project_dir') . '/public/assets', $imageName);
            $event->setImg($this->params->get('APP_URL') . '/assets/' . $imageName);
        } else {
            $event->setImg($this->params->get('APP_URL') . '/assets/event-background-desktop.png');
        }

        $invitees = json_decode($data['invitees'], true);
        $appUrl = $this->params->get('APP_URL');
        $shareLink = $appUrl . '/events/' . $event->getId();

        $event->setSharelink($shareLink);
        $entityManager->persist($event);
        $entityManager->flush();
        foreach ($invitees as $invitee) {
            if (filter_var($invitee, FILTER_VALIDATE_EMAIL)) {
                $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $invitee]);

                if (!$user) {
                 
                    $user = new User();
                    $user->setEmail($invitee);
                    $user->setPassword('12345'); 
                    $user->setPhoto('logimg.png');
                    $user->setRoles(['ROLE_INVITE']);
                    $user->setCreatedAt(new \DateTimeImmutable());
                    $entityManager->persist($user);
                    $entityManager->flush();
                }

               
                $uuid = UuidV4::v4();
                $link = $appUrl . '/events/' . $event->getId() . '?newconnection=' . $uuid;

                $userInvitation = new UserInvitation();
                $userInvitation->setEvent($event);
                $userInvitation->setUserId($user);
                $userInvitation->setDateInvitation(new \DateTime());
                $userInvitation->setLink($link);
                $userInvitation->setExpiration($event->getDateend());
                $entityManager->persist($userInvitation);
                $entityManager->flush();

                $emailContent = $this->renderView('email/email_invite_event.html.twig', [
                    'event' => $event,
                    'sender_name' => $this->getUser()->getUsername( ),
                    'link' => $link,
                    'APP_URL' => $appUrl,
                ]);
                
                $email = (new Email())
                    ->from('support@planit.com')
                    ->to($invitee)
                    ->subject('Invitation à un événement Plan-it')
                    ->html($emailContent);
                
                $mailer->send($email);
            }
        }

        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse([
                'message' => 'User not found',
            ], Response::HTTP_NOT_FOUND);
        }

       
        $userEvent = new UserEvent();
        $userEvent->setEvent($event);
        $userEvent->setUser($user);
        $userEvent->setRole('ROLE_ADMIN');
        $entityManager->persist($userEvent);
        $entityManager->flush();


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

        $user = $this->getUser();
        $appUrl = $this->params->get('APP_URL');
        if (!$user) {
            $email = $request->get('email');
            if (!$email) {
                return $this->json(['error' => 'Email is missing'], Response::HTTP_BAD_REQUEST);
            }
            $user = $userRepository->findOneBy(['email' => $email]);
            if ($user) {
                if (in_array("ROLE_USER" || "ROLE_ADMIN", $user->getRoles())) {
                    return $this->json(['error' => 'Account exists with this email, please log in'], Response::HTTP_BAD_REQUEST);
                }
                try {
                    
                    $event = $eventRepository->find($request->get('event'));

                    if (!$event) {
                        return $this->json(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
                    }

                  
                    $userCount = $entityManager->getRepository(UserEvent::class)->count(['event' => $event]);
                    if ($event->getMaxparticipant() != 0 && $userCount >= $event->getMaxparticipant()) {
                        return $this->json(['error' => 'Event has reached the maximum number of participants'], Response::HTTP_BAD_REQUEST);
                    }

                   
                    $existingUserEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
                        'event' => $event,
                        'user' => $user
                    ]);

                    if ($existingUserEvent) {
                        $emailInvitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
                            'event' => $event,
                            'user_id' => $user
                        ]);
                        $appUrl = $this->params->get('APP_URL');
                        if ($emailInvitation) {
                            $uuid = UuidV4::v4();
                            $link = $appUrl . '/events/' . $event->getId() . '?connection=' . $uuid;
                            $emailInvitation->setLink($link);
                            $emailInvitation->setDateInvitation(new \DateTime());
                            $entityManager->flush();

                            $emailContent = $this->renderView('email/email_join_event.html.twig', [
                                'event' => $event,
                                'link' => $link,
                                'APP_URL' => $appUrl,
                            ]);

                            $email = (new Email())
                                ->from('noreply@exemple.fr')
                                ->to($user->getEmail())
                                ->subject('Tu as rejoins un évènement')
                                ->html($emailContent);

                            $mailer->send($email);

                            return $this->json([
                                'message' => 'User successfully joined the event',
                                'uuid' => $uuid
                            ], Response::HTTP_OK);
                        }
                    }

                   
                    $userEvent = new UserEvent();
                    $userEvent->setEvent($event);
                    $userEvent->setUser($user);
                    $userEvent->setRole('ROLE_USER');
                    $entityManager->persist($userEvent);
                    $entityManager->flush();

                    $uuid = UuidV4::v4();
                    $link = $appUrl . '/events/' . $event->getId() . '?newconnection=' . $uuid;

                    $EmailInvitation = new UserInvitation();
                    $EmailInvitation->setEvent($event);
                    $EmailInvitation->setUserId($user);
                    $EmailInvitation->setDateInvitation(new \DateTime());
                    $EmailInvitation->setLink($link);
                    $EmailInvitation->setExpiration($event->getDateend());
                    $entityManager->persist($EmailInvitation);
                    $entityManager->flush();

                    $emailContent = $this->renderView('email/email_join_event.html.twig', [
                        'event' => $event,
                        'link' => $link,
                        'APP_URL' => $appUrl,
                    ]);

                    $email = (new Email())
                        ->from('noreply@exemple.fr')
                        ->to($user->getEmail())
                        ->subject('Tu as rejoins un évènement')
                        ->html($emailContent);

                    $mailer->send($email);

                    return $this->json([
                        'message' => 'User successfully joined the event',
                        'uuid' => $uuid
                    ], Response::HTTP_OK);
                } catch (\Exception $e) {
                    return $this->json(['error' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            } else {
                
                $user = new User();
                $user->setEmail($email);
                $user->setPassword('12345');
                $user->setPhoto('logimg.png');
                $user->setRoles(['ROLE_INVITE']);
                $user->setCreatedAt(new \DateTimeImmutable());
                $entityManager->persist($user);
                $entityManager->flush();

               
                $event = $eventRepository->find($request->get('event'));

                if (!$event) {
                    return $this->json(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
                }

                $userCount = $entityManager->getRepository(UserEvent::class)->count(['event' => $event]);
                if ($event->getMaxparticipant() != 0 && $userCount >= $event->getMaxparticipant()) {
                    return $this->json(['error' => 'Event has reached the maximum number of participants'], Response::HTTP_BAD_REQUEST);
                }

                
                $existingUserEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
                    'event' => $event,
                    'user' => $user
                ]);

                if ($existingUserEvent) {
                    return $this->json(['error' => 'User is already joined to the event'], Response::HTTP_BAD_REQUEST);
                }

               
                $userEvent = new UserEvent();
                $userEvent->setEvent($event);
                $userEvent->setUser($user);
                $userEvent->setRole('ROLE_USER');
                $entityManager->persist($userEvent);
                $entityManager->flush();

                $uuid = UuidV4::v4();
                $appUrl = $this->params->get('APP_URL');
                $link = $appUrl . '/events/' . $event->getId() . '?connection=' . $uuid;

                $EmailInvitation = new UserInvitation();
                $EmailInvitation->setEvent($event);
                $EmailInvitation->setUserId($user);
                $EmailInvitation->setDateInvitation(new \DateTime());
                $EmailInvitation->setLink($link);
                $EmailInvitation->setExpiration($event->getDateend());
                $entityManager->persist($EmailInvitation);
                $entityManager->flush();

                $emailContent = $this->renderView('email/email_join_event.html.twig', [
                    'event' => $event,
                    'link' => $link,
                    'APP_URL' => $appUrl,
                ]);

                $email = (new Email())
                    ->from('noreply@exemple.fr')
                    ->to($user->getEmail())
                    ->subject('Tu as rejoins un évènement')
                    ->html($emailContent);

                $mailer->send($email);

                return $this->json([
                    'message' => 'User successfully joined the event',
                    'uuid' => $uuid
                ], Response::HTTP_OK);
            }
        }
        
        $event = $eventRepository->find($request->get('event'));

        if (!$event) {
            return $this->json(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        $userCount = $entityManager->getRepository(UserEvent::class)->count(['event' => $event]);
        if ($event->getMaxparticipant() != 0 && $userCount >= $event->getMaxparticipant()) {
            return $this->json(['error' => 'Event has reached the maximum number of participants'], Response::HTTP_BAD_REQUEST);
        }

      
        $existingUserEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
            'event' => $event,
            'user' => $user
        ]);

        if ($existingUserEvent) {
            return $this->json(['error' => 'User is already joined to the event'], Response::HTTP_BAD_REQUEST);
        }

  
        $userEvent = new UserEvent();
        $userEvent->setEvent($event);
        $userEvent->setUser($user);
        $userEvent->setRole('ROLE_USER');
        $entityManager->persist($userEvent);
        $entityManager->flush();

        return $this->json([
            'message' => 'User successfully joined the event',
        ], Response::HTTP_OK);
    }


#[Route('/event/{id}', name: 'app_event_get', methods: ['GET'])]
public function getevent (Request $request , EventRepository $eventRepository , EntityManagerInterface $entityManager): JsonResponse
{
    $event = $eventRepository->find($request->get('id'));
    if (!$event || $event->getDeletedDate()) {
        return $this->json(['error'=> 'Event not found'], Response::HTTP_NOT_FOUND);
    }
   
    $adminUserEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
        'event' => $event,
        'role' => 'ROLE_ADMIN'
    ]);

        $adminEmail = $adminUserEvent ? $adminUserEvent->getUser()->getEmail() : null;
        $adminUsername = $adminUserEvent ? $adminUserEvent->getUser()->getUsername() : null;


   
        $userCount = $entityManager->getRepository(UserEvent::class)->count(['event' => $event]);

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
            'adminEmail' => $adminEmail,
            'adminUsername' => $adminUsername,
            'userCount' => $userCount,
            'img' => $event->getImg(),
        ];
        return $this->json($eventData, JsonResponse::HTTP_OK);
    }


    #[Route('/api/events/upcoming', name: 'get_upcoming_events', methods: ['GET'])]
    public function getUpcomingEvents(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $currentDate = new \DateTime();
            $user = $this->getUser(); 

     
            $page = $request->query->getInt('page', 1);
            $limit = 10; 
            $offset = ($page - 1) * $limit;

            
            $queryBuilder = $entityManager->createQueryBuilder();
            $queryBuilder
                ->select('e')
                ->from(Event::class, 'e')
                ->where('e.datestart > :currentDate')
                ->andWhere('e.visibility = :visibility')
                ->andWhere('e.deleted_date IS NULL')
                ->setParameter('currentDate', $currentDate)
                ->setParameter('visibility', 1); 

            
            if ($user) {
                $queryBuilder
                    ->andWhere('NOT EXISTS (
                        SELECT ue
                        FROM App\Entity\UserEvent ue
                        WHERE ue.event = e
                        AND ue.user = :user
                    )')
                    ->setParameter('user', $user);
            }

            $queryBuilder
                ->orderBy('e.datestart', 'ASC')
                ->setMaxResults($limit)
                ->setFirstResult($offset);

            $events = $queryBuilder->getQuery()->getResult();

            
            $totalQueryBuilder = $entityManager->createQueryBuilder();
            $totalQueryBuilder
                ->select('COUNT(e)')
                ->from(Event::class, 'e')
                ->where('e.datestart > :currentDate')
                ->andWhere('e.visibility = :visibility')
                ->andWhere('e.deleted_date IS NULL')
                ->setParameter('currentDate', $currentDate)
                ->setParameter('visibility', 1);

            
            if ($user) {
                $totalQueryBuilder
                    ->andWhere('NOT EXISTS (
                        SELECT ue
                        FROM App\Entity\UserEvent ue
                        WHERE ue.event = e
                        AND ue.user = :user
                    )')
                    ->setParameter('user', $user);
            }

            $totalEvents = $totalQueryBuilder->getQuery()->getSingleScalarResult();

         
            $formattedEvents = [];
            foreach ($events as $event) {
                $formattedEvents[] = [
                    'id' => $event->getId(),
                    'title' => $event->getTitle(),
                    'description' => $event->getDescription(),
                    'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
                    'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
                    'location' => $event->getLocation(),
                    'maxparticipant' => $event->getMaxparticipant(),
                    'img' => $event->getImg(),
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
    public function getAllEvents( Request $request, EntityManagerInterface $entityManager , EventRepository $eventRepository): JsonResponse
    {
        $events = $eventRepository->createQueryBuilder('e')
            ->where('e.deleted_date IS NULL')
            ->getQuery()
            ->getResult();

        $formattedEvents = [];
        foreach ($events as $event) {

            $formattedEvents[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
                'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'maxparticipant' => $event->getMaxparticipant(),
                'img' => $event->getImg(),
                'sharelink' => $event->getSharelink(),
                'isPublic' => $event->getVisibility()
            ];
        }

        return new JsonResponse($formattedEvents, JsonResponse::HTTP_OK);
    }

    #[Route('/api/event/search', name: 'search_events', methods: ['GET'])]
    public function searchEvents(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
       $user = $this->getUser();

       if($user){
        $queryBuilder = $entityManager->createQueryBuilder();
        $queryBuilder
            ->select('e')
            ->from(Event::class, 'e')
            ->leftJoin(UserEvent::class, 'ue', 'WITH', 'ue.event = e.id')
            ->where('ue.user = :user OR e.visibility = :visibility')
            ->andWhere('e.deleted_date IS NULL')
            ->setParameter('user', $user)
            ->setParameter('visibility', 1)
            ->orderBy('e.datestart', 'ASC');

        $events = $queryBuilder->getQuery()->getResult();
       }
         else{
            $queryBuilder = $entityManager->createQueryBuilder();
            $queryBuilder
                ->select('e')
                ->from(Event::class, 'e')
                ->where('e.visibility = :visibility')
                ->andWhere('e.deleted_date IS NULL')
                ->setParameter('visibility', 1)
                ->orderBy('e.datestart', 'ASC');

            $events = $queryBuilder->getQuery()->getResult();
         }
        $formattedEvents = [];
        foreach ($events as $event) {

            $formattedEvents[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
                'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'maxparticipant' => $event->getMaxparticipant(),
                'img' => $event->getImg(),
                'sharelink' => $event->getSharelink(),
                'visibility' => $event->getVisibility()
            ];
        }
        
        return new JsonResponse($formattedEvents, JsonResponse::HTTP_OK);
    }

    #[Route('/userevents/{eventid}', name: 'get_event_users_1', methods: ['GET'])]
    public function getEventUsers($eventid, Request $request, EntityManagerInterface $entityManager, JWTEncoderInterface $jwtEncoder, UserProviderInterface $userProvider): JsonResponse
    {
        
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['isLog' => false, 'error' => 'Invalid token'], Response::HTTP_UNAUTHORIZED);
        }

     
        $event = $entityManager->getRepository(Event::class)->find($eventid);

        if (!$event) {
            return new JsonResponse(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

       
        $userEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
            'event' => $event,
            'user' => $user
        ]);

        if (!$userEvent) {
            return new JsonResponse(['isLog' => false, 'message' => 'User is not joined to the event'], Response::HTTP_BAD_REQUEST);
        }

        $role =  $userEvent->getRole();
        return new JsonResponse(['isLog' => true, 'Role' => $role], JsonResponse::HTTP_OK);
    }



    #[Route('/userevents/{event}/new-connection-uuid', name: 'get_event_newusers_invited', methods: ['POST'])]
    public function newConnectionUuid($event, Request $request, EntityManagerInterface $entityManager, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $uuid = $data['uuid'] ?? null;
        
        $appUrl = $this->params->get('APP_URL');
        $invitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
            'event' => $event,
            'link' => $appUrl . '/events/' . $event . '?newconnection=' . $uuid
        ]);

        if ($invitation) {
            $userId = $invitation->getUserId();
            $user = $entityManager->getRepository(User::class)->find($userId);
       
            $userEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
                'event' => $event,
                'user' => $userId
            ]);

            if ($userEvent) {
                return new JsonResponse(['isValid' => true], Response::HTTP_OK);
            } else {


                $userCount = $entityManager->getRepository(UserEvent::class)->count(['event' => $event]);
                $eventObject = $entityManager->getRepository(Event::class)->find($event);
                if ($eventObject->getMaxparticipant() != 0 && $userCount >= $eventObject->getMaxparticipant()) {
                    return new JsonResponse(['error' => 'Event has reached the maximum number of participants'], Response::HTTP_BAD_REQUEST);
                }

         
                $invitation->setDateAcceptinvitation(new \DateTime());
                $entityManager->flush();

                $event = $entityManager->getRepository(Event::class)->find($event);
                $eventvisibility = $event->getVisibility();
                if ($eventvisibility === 0) {
                    if ($userId->getRoles() === ['ROLE_INVITE']) {
                        return new JsonResponse(['isValid' => false, 'message' => 'User with ROLE_INVITE cannot join the event'], Response::HTTP_FORBIDDEN);
                    } else {
                        $invitation->setLink('');
                        $entityManager->flush();
                    }
                }
                if ($eventvisibility === 1) {
                   
                    $uuid = UuidV4::v4();
                    $link = $appUrl . '/events/' . $event->getId() . '?connection=' . $uuid;

               
                    $invitation->setLink($link);
                    $entityManager->flush();

                    $emailContent = $this->renderView('email/email_join_event.html.twig', [
                        'event' => $event,
                        'link' => $link,
                        'APP_URL' => $appUrl,
                    ]);
    
                    $email = (new Email())
                        ->from('noreply@exemple.fr')
                        ->to($user->getEmail())
                        ->subject('Tu as rejoins un évènement')
                        ->html($emailContent);
    
                    $mailer->send($email);
                }
               
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

  
        $appUrl = $this->params->get('APP_URL');
        $invitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
            'event' => $event,
            'link' => $appUrl . '/events/' . $event . '?connection=' . $uuid
        ]);

        if ($invitation) {
            $userId = $invitation->getUserId();

        
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
    public function LeaveEventConnecteduser($event, EntityManagerInterface $entityManager, Request $request, JWTEncoderInterface $jwtEncoder, UserProviderInterface $userProvider): JsonResponse
    {
        $user = $this->getUser();


        if (!$user) {

            $data = json_decode($request->getContent(), true);
            $uuid = $data['uuid'] ?? null;
            if (!$uuid) {
                return new JsonResponse(['error' => 'UUID is missing'], Response::HTTP_BAD_REQUEST);
            }

            $event = $entityManager->getRepository(Event::class)->find($event);
            $appUrl = $this->params->get('APP_URL');
           
            $userInvitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
                'event' => $event,
                'link' => $appUrl . '/events/' . $event->getId() . '?connection=' . $uuid
            ]);
            if ($event->getVisibility() === 1 && !$userInvitation) {
                $userInvitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
                    'event' => $event,
                    'link' => $appUrl . '/events/' . $event->getId() . '?newconnection=' . $uuid
                ]);
            }
            if (!$userInvitation) {
                return new JsonResponse(['error' => 'Invalid UUID or invitation not found'], Response::HTTP_BAD_REQUEST);
            }

            $userid = $userInvitation->getUserId();

            $User = $entityManager->getRepository(User::class)->find($userid);
            if (!$User) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

           
            $userEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
                'event' => $event,
                'user' => $User
            ]);

            if ($userEvent) {
                $entityManager->remove($userEvent);
            }

           
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


        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

       
        $event = $entityManager->getRepository(Event::class)->find($event);

        $userEvent = $entityManager->getRepository(UserEvent::class)->findOneBy([
            'event' => $event,
            'user' => $user
        ]);

        if ($userEvent && $userEvent->getRole() === 'ROLE_ADMIN') {
            return new JsonResponse(['error' => 'Admin users cannot unsubscribe from the event'], Response::HTTP_FORBIDDEN);
        }

      
        if ($userEvent) {
            $entityManager->remove($userEvent);
        }


        if ($userEvent) {
            $entityManager->remove($userEvent);
        }

    
        $userInvitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
            'event' => $event,
            'user_id' => $user
        ]);

        if ($userInvitation) {
            $entityManager->remove($userInvitation);
        }

        $entityManager->flush();

        return new JsonResponse(['message' => 'User successfully left the event'], Response::HTTP_OK);
    }

    #[Route('/userevents/{id}/share', name: 'share_event', methods: ['POST'])]
    public function shareEvent($id, Request $request, EntityManagerInterface $entityManager, MailerInterface $mailer): JsonResponse
    {
        $event = $entityManager->getRepository(Event::class)->find($id);

        if (!$event) {
            return new JsonResponse(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        if ($event->getVisibility() !== 0) {
            return new JsonResponse(['error' => 'Event is not private'], Response::HTTP_BAD_REQUEST);
        }

        $data = json_decode($request->getContent(), true);
        $emails = $data['emails'] ?? null;

        if (empty($emails) || !is_array($emails)) {
            return new JsonResponse(['error' => 'Invalid email list'], Response::HTTP_BAD_REQUEST);
        }

        $appUrl = $this->params->get('APP_URL');

        foreach ($emails as $email) {
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

                if (!$user) {
                    $user = new User();
                    $user->setEmail($email);
                    $user->setPassword('12345');
                    $user->setPhoto('logimg.png');
                    $user->setRoles(['ROLE_INVITE']);
                    $user->setCreatedAt(new \DateTimeImmutable());
                    $entityManager->persist($user);
                    $entityManager->flush();
                }

                $uuid = UuidV4::v4();
                $link = $appUrl . '/events/' . $event->getId() . '?newconnection=' . $uuid;

                $userInvitation = new UserInvitation();
                $userInvitation->setEvent($event);
                $userInvitation->setUserId($user);
                $userInvitation->setDateInvitation(new \DateTime());
                $userInvitation->setLink($link);
                $userInvitation->setExpiration($event->getDateend());
                $entityManager->persist($userInvitation);
                $entityManager->flush();

                $emailContent = $this->renderView('email/email_join_privateevent.html.twig', [
                    'event' => $event,
                    'link' => $link,
                    'APP_URL' => $appUrl,
                ]);

                $emailMessage = (new Email())
                    ->from('no-reply@example.com')
                    ->to($email)
                    ->subject('You are invited to an event')
                    ->html($emailContent);

                $mailer->send($emailMessage);
            }
        }

        return new JsonResponse(['message' => 'Invitations sent successfully'], Response::HTTP_OK);
    }

    #[Route('/events/{id}/admin', name: 'get_event_admin', methods: ['GET'])]
    public function getEventAdmin(int $id, EntityManagerInterface $entityManager, UserEventRepository $userEventRepository): JsonResponse
    {
        try {
        
            $adminUserEvent = $userEventRepository->findEventAdmin($id);

            if (!$adminUserEvent) {
                return new JsonResponse(['error' => 'Admin not found for this event'], Response::HTTP_NOT_FOUND);
            }

            $adminUser = $adminUserEvent->getUser();

            return new JsonResponse([
                'admin' => [
                    'id' => $adminUser->getId(),
                    'email' => $adminUser->getEmail(),
                    'username' => $adminUser->getUsername()
                ]
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'An error occurred while fetching the event admin: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/events/{id}', name: 'edit_event', methods: ['POST'])]
    public function editEvent(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,

    ): JsonResponse {
        try {
            $user = $this->getUser();
            if (!$user) {
                return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
            }
            
            $event = $entityManager->getRepository(Event::class)->find($id);
            if (!$event) {
                return new JsonResponse(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
            }

 
            $useradmin = $entityManager->getRepository(UserEvent::class)->findOneBy([
                'event' => $event,
                'user' => $user,
                'role' => 'ROLE_ADMIN'
            ]);

            if (!$useradmin) {
                return new JsonResponse(['error' => 'Only the event administrator can edit the event'], Response::HTTP_FORBIDDEN);
            }
          
            $data = json_decode($request->getContent(), true);
            $file = $request->files->get('file');

      
            if (isset($data['title'])) {
                $event->setTitle($data['title']);
            }
            if (isset($data['description'])) {
                $event->setDescription($data['description']);
            }
            if (isset($data['datestart'])) {
                $event->setDatestart(new \DateTime($data['datestart']));
            }
            if (isset($data['dateend'])) {
                $event->setDateend(new \DateTime($data['dateend']));
            }
            if (isset($data['location'])) {
                $event->setLocation($data['location']);
            }
            if (isset($data['maxparticipant'])) {
                $event->setMaxparticipant($data['maxparticipant']);
            }
            if (isset($data['visibility'])) {
                $event->setVisibility($data['visibility'] === 'public' ? 1 : 0);
            }
            if ($file) {
                $imageName = uniqid() . '.' . $file->guessExtension();

          
                $oldImageName = $event->getImg();
                if ($oldImageName && $oldImageName !== 'event-background-desktop.png') {
                    $oldImagePath = $this->getParameter('kernel.project_dir') . '/public/assets/' . basename($oldImageName);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                
                $file->move($this->getParameter('kernel.project_dir') . '/public/assets', $imageName);
                $event->setImg($this->params->get('APP_URL') . '/assets/' . $imageName);
            }

      
            $entityManager->flush();

           
            return new JsonResponse([
                'message' => 'Event updated successfully',
                'event' => [
                    'id' => $event->getId(),
                    'title' => $event->getTitle(),
                    'description' => $event->getDescription(),
                    'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
                    'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
                    'location' => $event->getLocation(),
                    'maxparticipant' => $event->getMaxparticipant(),
                    'visibility' => $event->getVisibility(),
                    'img' => $event->getImg()
                ]
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'An error occurred while updating the event: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/event/{eventId}/users/{userId}', name: 'remove_user_from_event', methods: ['DELETE'])]
    public function removeUserFromEvent(
        int $eventId,
        int $userId,
        EntityManagerInterface $entityManager,
        UserEventRepository $userEventRepository
    ): JsonResponse {
        try {
            $user = $this->getUser();
            if (!$user) {
                return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
            }
    
            $event = $entityManager->getRepository(Event::class)->find($eventId);
            if (!$event) {
                return new JsonResponse(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
            }


            $useradmin = $entityManager->getRepository(UserEvent::class)->findOneBy([
                'event' => $event,
                'user' => $user,
                'role' => 'ROLE_ADMIN'
            ]);

            if (!$useradmin) {
                return new JsonResponse(['error' => 'Only the event administrator can edit the event'], Response::HTTP_FORBIDDEN);
            }
        
            $userdelete = $entityManager->getRepository(User::class)->find($userId);
            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

  
            $userEvent = $userEventRepository->findOneBy([
                'event' => $event,
                'user' => $userdelete
            ]);

            if (!$userEvent) {
                return new JsonResponse(['error' => 'User is not registered for this event'], Response::HTTP_NOT_FOUND);
            }

            
            if ($userEvent->getRole() === 'ROLE_ADMIN') {
                return new JsonResponse(
                    ['error' => 'Cannot remove the event administrator'],
                    Response::HTTP_FORBIDDEN
                );
            }

         $entityManager->remove($userEvent);

    
            $invitation = $entityManager->getRepository(UserInvitation::class)->findOneBy([
                'event' => $event,
                'user_id' => $userdelete
            ]);

            if ($invitation) {
                $entityManager->remove($invitation);
            }

            $entityManager->flush();

            return new JsonResponse([
                'message' => 'User successfully removed from event'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'An error occurred while removing user from event: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    #[Route('/events/delete/{id}', name: 'delete_event', methods: ['POST'])]
    public function deleteEvent(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $user = $this->getUser();
            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }
            $useradmin = $entityManager->getRepository(UserEvent::class)->findOneBy([
                'event' => $id,
                'user' => $user,
                'role' => 'ROLE_ADMIN'
            ]);
            if (!$useradmin) {
                return new JsonResponse(['error' => 'User is not the admin of this event'], Response::HTTP_FORBIDDEN);
            }
          
            $event = $entityManager->getRepository(Event::class)->find($id);
            if (!$event) {
                return new JsonResponse(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
            }

       
            $event->setDeletedDate(new \DateTime());
            $entityManager->flush();

            return new JsonResponse(['message' => 'Event deleted successfully'], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'An error occurred while deleting the event: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
