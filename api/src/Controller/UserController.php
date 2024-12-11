<?php

namespace App\Controller;

use App\Entity\UserEvent;
use App\Repository\UserEventRepository;
use App\Service\AmazonS3Service;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Email;
use Symfony\Component\Uid\Uuid;
use App\Entity\User;
use App\Entity\Event;
use App\Entity\UserInvitation;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use DateTime;

class UserController extends AbstractController
{
    private $s3Service;
    private $params;


    public function __construct(AmazonS3Service $s3Service, ParameterBagInterface $params)
    {
        $this->s3Service = $s3Service;
        $this->params = $params;
    }

    #[Route('/api/users/username' , name:'app_users_username', methods: ['POST'])]
    public function index(Request $request,  EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): Response
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'])) {
            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (null === $user) {
            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_NOT_FOUND);
        }

        if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['username' => $user->getUsername()], Response::HTTP_OK);
    }
    
    #[Route('/users/{id}', name: 'app_users_update', methods: ['POST'])]
    public function updateUser(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): Response {
        $data = json_decode($request->getContent(), true);
        $user = $entityManager->getRepository(User::class)->find($id);

        if (null === $user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Mise à jour du username
        if (isset($data['username'])) {
            $existingUser = $entityManager->getRepository(User::class)->findOneBy(['username' => $data['username']]);
            if (null !== $existingUser && $existingUser->getId() !== $user->getId()) {
                return $this->json(['message' => 'Username already exists'], Response::HTTP_CONFLICT);
            }
            $user->setUsername($data['username']);
        }

        // Mise à jour du firstname
        if (isset($data['firstname'])) {
            $user->setFirstname($data['firstname']);
        }

        // Mise à jour du lastname
        if (isset($data['lastname'])) {
            $user->setLastname($data['lastname']);
        }

        // Mise à jour de l'email
        if (isset($data['email'])) {
            $existingEmail = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if (null !== $existingEmail && $existingEmail->getId() !== $user->getId()) {
                return $this->json(['message' => 'Email already exists'], Response::HTTP_CONFLICT);
            }
            $user->setEmail($data['email']);
        }

        // Mise à jour du mot de passe
        if (isset($data['oldPassword'], $data['newPassword'])) {
            if (!$passwordHasher->isPasswordValid($user, $data['oldPassword'])) {
                return $this->json(['message' => 'Old password is incorrect'], Response::HTTP_BAD_REQUEST);
            }

            $newHashedPassword = $passwordHasher->hashPassword($user, $data['newPassword']);
            $user->setPassword($newHashedPassword);
        }

        // Persistance des modifications
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'User updated successfully'], Response::HTTP_OK);
    }

    #[Route('/users/photo/{id}', name: 'app_users_update_photo', methods: ['POST'])]
    public function updateUserPhoto(int $id, EntityManagerInterface $entityManager , Request $request): Response
    {
    $user = $entityManager->getRepository(User::class)->find($id);
    $file = $request->files->get('file');

    if (!$file) {
        return $this->json(['message' => 'No file provided'], Response::HTTP_BAD_REQUEST);
    }

    // Delete the old photo from S3
    $oldPhoto = $user->getPhoto();
    if ($oldPhoto && $oldPhoto !== 'logimg.png') {
        $this->s3Service->deleteObject($oldPhoto);
    }

    // Generate a new filename with UUID
    $extension = $file->guessExtension();
    $newFilename = uniqid() . '.' . $extension;

    // Upload the new photo to S3
    $this->s3Service->uploadObject($newFilename, $file->getPathname());

    // Update the user's photo
    $user->setPhoto($newFilename);

    // Persist the changes
    $entityManager->persist($user);
    $entityManager->flush();

    return $this->json(['message' => 'User photo updated successfully'], Response::HTTP_OK);
    }

    #[Route('/user/{id}/events', name: 'get_user_events', methods: ['GET'])]
    public function getUserEvents(int $id, UserEventRepository $userEventRepository): JsonResponse
    {
        $currentDate = new DateTime();
        $userEvents = $userEventRepository->findUpcomingEvents($id, $currentDate);

        // Debug information
        error_log('Current date: ' . $currentDate->format('Y-m-d H:i:s'));
        error_log('Number of events found: ' . count($userEvents));

        if (!$userEvents) {
            return $this->json(['message' => 'No events found for this user'], JsonResponse::HTTP_NOT_FOUND);
        }

        $events = [];
        foreach ($userEvents as $userEvent) {
            $event = $userEvent->getEvent();
            if ($event->getDeletedDate() !== null) {
                continue;
            }

            $imgName = $event->getImg();
            $fullImgUrl = $imgName ? $this->s3Service->getObjectUrl($imgName) : null;

            $eventData = [
                'eventId' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
                'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'img' => $fullImgUrl,
                'visibility' => $event->getVisibility(),
            ];

            $events[] = $eventData;
        }

        return $this->json($events, JsonResponse::HTTP_OK);
    }
}