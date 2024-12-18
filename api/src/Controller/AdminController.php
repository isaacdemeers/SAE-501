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

class AdminController extends AbstractController
{
    private $s3Service;
    private $params;


    public function __construct(AmazonS3Service $s3Service, ParameterBagInterface $params)
    {
        $this->s3Service = $s3Service;
        $this->params = $params;
    }

    #[Route('/admin/users/{id}', name: 'app_users_get', methods: ['GET'])]
    public function getAdminUser(int $id, EntityManagerInterface $entityManager): Response
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        if (null === $user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        $disable = $user->getDeletedat() !== null;
        $imgName = $user->getPhoto();
        if($imgName != 'logimg.png' && $imgName != 'default.jpg'){
            $fullImgUrl = $this->s3Service->getObjectUrl($imgName);
            $userData = [
                'id' => $user->getId(),
                'password' => $user->getPassword(),
                'emailverify' => $user->isEmailverify(),
                'tokenpassword' => $user->getTokenpassword(),
                'role' => $user->getRoles(),
                'emaillink' => $user->getEmaillink(),
                'deleted_at' => $user->getDeletedat(),
                'created_at' => $user->getCreatedat(),
                'username' => $user->getUsername(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'email' => $user->getEmail(),
                'photo' => $fullImgUrl,
                'disable' => $disable
            ];
        }
      else{
        $userData = [
            'id' => $user->getId(),
            'password' => $user->getPassword(),
            'emailverify' => $user->isEmailverify(),
            'tokenpassword' => $user->getTokenpassword(),
            'role' => $user->getRoles(),
            'emaillink' => $user->getEmaillink(),
            'deleted_at' => $user->getDeletedat(),
            'created_at' => $user->getCreatedat(),
            'username' => $user->getUsername(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'email' => $user->getEmail(),
            'photo' => $user->getPhoto(),
            'disable' => $disable
        ];
    }
        return $this->json($userData, Response::HTTP_OK);
    }

    #[Route('/admin/users/{id}', name: 'app_users_update_admin', methods: ['POST'])]
    public function updateAdminUser(int $id, Request $request, EntityManagerInterface $entityManager, MailerInterface $mailer, JWTTokenManagerInterface $JWTManager, ParameterBagInterface $params): Response
    {
        $data = json_decode($request->request->get('data'), true);
        $file = $request->files->get('file');

        $user = $entityManager->getRepository(User::class)->find($id);

        if (null === $user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Store the current password
        $currentPassword = $user->getPassword();

        // Update username
        if (isset($data['username'])) {
            $existingUser = $entityManager->getRepository(User::class)->findOneBy(['username' => $data['username']]);
            if (null !== $existingUser && $existingUser->getId() !== $user->getId()) {
                return $this->json(['message' => 'Username already exists'], Response::HTTP_CONFLICT);
            }
            $user->setUsername($data['username']);
        }

        if(isset($data['role'])){
            $user->setRoles([$data['role']]);
        }
        // Update firstname
        if (isset($data['firstname'])) {
            $user->setFirstname($data['firstname']);
        }

        // Update lastname
        if (isset($data['lastname'])) {
            $user->setLastname($data['lastname']);
        }

        // Update email
        if (isset($data['email'])) {
            $existingEmail = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if (null !== $existingEmail && $existingEmail->getId() !== $user->getId()) {
                return $this->json(['message' => 'Email already exists'], Response::HTTP_CONFLICT);
            }
            $user->setEmail($data['email']);
        }

        // Update photo
        if (isset($data['photo']) && !$file) {
            $photo = $user->getPhoto();
            if ($photo == 'logimg.png' || $photo == 'default.jpg') {
            } elseif ($data['photo'] === 'logimg.png' || $data['photo'] === 'default.jpg') {
                if ($photo != 'logimg.png' && $photo != 'default.jpg') {
                    $this->s3Service->deleteObject($photo);
                }
                $user->setPhoto($data['photo']);
            }
        } elseif ($file) {
            // Delete the old photo from S3 if it's not the default one
            $oldPhoto = $user->getPhoto();
            if ($oldPhoto && $oldPhoto !== 'logimg.png' && $oldPhoto !== 'default.jpg') {
                $this->s3Service->deleteObject($oldPhoto);
            }

            // Generate a new filename with UUID
            $extension = $file->guessExtension();
            $newFilename = uniqid() . '.' . $extension;

            // Upload the new photo to S3
            $this->s3Service->uploadObject($newFilename, $file->getPathname());

            // Update the user's photo
            $user->setPhoto($newFilename);
        }

        // Regenerate token and send reset password email
        if (isset($data['regenerateToken']) && $data['regenerateToken'] === true) {
            // Generate JWT token for the user with the email
            $token = $JWTManager->create($user);

            // Store the token in the user's tokenpassword variable
            $user->setTokenPassword($token);

            $appUrl = rtrim($params->get('APP_URL'), '/');
            $resetLink = sprintf('%s/resetpassword/%s', $appUrl, $token);

            $emailMessage = (new Email())
                ->from('noreply@votredomaine.com')
                ->to($user->getEmail())
                ->subject('Reset your password')
                ->html(sprintf('Click <a href="%s">here</a> to reset your password.', $resetLink));

            try {
                $mailer->send($emailMessage);
            } catch (\Exception $e) {
                return $this->json(['message' => 'Failed to send email', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        // Update email verification status
        if (isset($data['emailverify'])) {
            $user->setEmailverify($data['emailverify']);
        }

        // Update deleted_at date if disable is true
        if (isset($data['disable'])) {
            if ($data['disable'] === true) {
                $user->setDeletedat(new DateTime());
            } elseif ($data['disable'] === false) {
                $user->setDeletedat(null);
            }
        }

        // Regenerate email verification link and send verification email
        if (isset($data['regenerateemaillink']) && $data['regenerateemaillink'] === true) {
            $appUrl = $params->get('APP_URL');
            $confirmationToken = Uuid::v4()->toRfc4122();
            $user->setEmaillink($confirmationToken);
            $verificationLink = $appUrl . '/verify-email/' . $confirmationToken;

            $email = (new Email())
                ->from('no-reply@example.com')
                ->to($user->getEmail())
                ->subject('Please Confirm your Email')
                ->html('<p>Please confirm your email by clicking on the following link: <a href="' . $verificationLink . '">Verify Email</a></p>');

            try {
                $mailer->send($email);
            } catch (\Exception $e) {
                return $this->json(['message' => 'Failed to send verification email', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        // Restore the original password if it wasn't changed
        if (!isset($data['password'])) {
            $user->setPassword($currentPassword);
        }

        // Persist the changes
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'User updated successfully'], Response::HTTP_OK);
        $entityManager->flush();

        return $this->json(['message' => 'User updated successfully'], Response::HTTP_OK);
    }
}



    #[Route('/admin/events/{id}', name: 'app_events_get', methods: ['GET'])]
    public function getAdminEvent(int $id, EntityManagerInterface $entityManager): Response
    {
        $event = $entityManager->getRepository(Event::class)->find($id);

        if (null === $event) {
            return $this->json(['message' => 'event not found'], Response::HTTP_NOT_FOUND);
        }
        $disable = $event->getDeletedDate() !== null;
        $imgName = $event->getImg();

            $fullImgUrl = $this->s3Service->getObjectUrl($imgName);
            $eventData = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'datestart' => $event->getDatestart(),
                'dateend' => $event->getDateend(),
                'deleted_at' => $event->getDeletedDate(),
                'created_at' => $event->getCreatedAt(),
                'location' => $event->getLocation(),
                'Sharelink' => $event->getSharelink(),
                'visibility' => $event->getVisibility(),
                'maxparticipants' => $event->getMaxparticipant(),
                'img' => $fullImgUrl,
                'disable' => $disable
            ];
        return $this->json($eventData, Response::HTTP_OK);
    }

    #[Route('/admin/events/{id}', name: 'app_events_update', methods: ['POST'])]
    public function updateAdminEvent(int $id, Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): Response
    {
        $data = json_decode($request->request->get('data'), true);
        $file = $request->files->get('file');

        $event = $entityManager->getRepository(Event::class)->find($id);

        if (null === $event) {
            return $this->json(['message' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        // Update title
        if (isset($data['title'])) {
            $event->setTitle($data['title']);
        }

        // Update description
        if (isset($data['description'])) {
            $event->setDescription($data['description']);
        }

        // Update datestart
        if (isset($data['datestart'])) {
            $event->setDatestart(new DateTime($data['datestart']));
        }

        // Update dateend
        if (isset($data['dateend'])) {
            $event->setDateend(new DateTime($data['dateend']));
        }

        // Update location
        if (isset($data['location'])) {
            $event->setLocation($data['location']);
        }

        // Update visibility
        if (isset($data['visibility'])) {
            $event->setVisibility($data['visibility']);
        }

        // Update maxparticipants
        if (isset($data['maxparticipants'])) {
            $event->setMaxparticipant($data['maxparticipants']);
        }

        // Update photo
        if (isset($data['img']) && !$file) {
            $img = $event->getImg();
            if ($img == 'event-background-desktop.png') {
            } elseif ($data['img'] === 'event-background-desktop.png') {
                if ($img != 'event-background-desktop.png') {
                    $this->s3Service->deleteObject($img);
                }
                $event->setImg($data['img']);
            }
        } elseif ($file) {
            // Delete the old photo from S3 if it's not the default one
            $oldPhoto = $event->getImg();
            if ($oldPhoto && $oldPhoto !== 'event-background-desktop.png') {
                $this->s3Service->deleteObject($oldPhoto);
            }
        
            // Generate a new filename with UUID
            $extension = $file->guessExtension();
            $newFilename = uniqid() . '.' . $extension;
            
            // Upload the new photo to S3
            $this->s3Service->uploadObject($newFilename, $file->getPathname());
            
            // Update the event's photo
            $event->setImg($newFilename);
            
        }

    if   (isset($data['disable'])) {
                if ($data['disable'] === true) {
                    $event->setDeletedDate(new DateTime());
                } elseif ($data['disable'] === false) {
                    $event->setDeletedDate(null);
                }
            }
            
            // Persist the changes
            $entityManager->persist($event);
            $entityManager->flush();
    
            return $this->json(['message' => 'Event updated successfully'], Response::HTTP_OK);

    }
    
#[Route('/admin/events/{id}', name: 'app_admin_events_delete', methods: ['DELETE'])]
public function deleteAdminEvent(int $id, EntityManagerInterface $entityManager): Response
{
    $event = $entityManager->getRepository(Event::class)->find($id);

    if (null === $event) {
        return $this->json(['message' => 'Event not found'], Response::HTTP_NOT_FOUND);
    }

    // Delete all UserEvent entities related to this event
    $userEvents = $entityManager->getRepository(UserEvent::class)->findBy(['event' => $event]);
    foreach ($userEvents as $userEvent) {
        $entityManager->remove($userEvent);
    }

    // Delete all UserInvitation entities related to this event
    $userInvitations = $entityManager->getRepository(UserInvitation::class)->findBy(['event' => $event]);
    foreach ($userInvitations as $userInvitation) {
        $entityManager->remove($userInvitation);
    }

    // Delete the event
    $entityManager->remove($event);
    $entityManager->flush();

    return $this->json(['message' => 'Event, related user events, and user invitations deleted successfully'], Response::HTTP_OK);
}

#[Route('/admin/users/{id}', name: 'app_admin_users_delete', methods: ['DELETE'])]
public function deleteAdminUser(int $id, EntityManagerInterface $entityManager): Response
{
    $user = $entityManager->getRepository(User::class)->find($id);

    if (null === $user) {
        return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
    }

    // Delete all UserEvent entities related to this user
    $userEvents = $entityManager->getRepository(UserEvent::class)->findBy(['user' => $user]);
    foreach ($userEvents as $userEvent) {
        $entityManager->remove($userEvent);
    }

    // Delete all UserInvitation entities related to this user
    $userInvitations = $entityManager->getRepository(UserInvitation::class)->findBy(['user_id' => $user]);
    foreach ($userInvitations as $userInvitation) {
        $entityManager->remove($userInvitation);
    }

    // Delete the user
    $entityManager->remove($user);
    $entityManager->flush();

    return $this->json(['message' => 'User, related user events, and user invitations deleted successfully'], Response::HTTP_OK);
}
}