<?php

namespace App\Controller;


use App\Entity\UserEvent;
use App\Repository\UserEventRepository;
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
    private $params;


    public function __construct(ParameterBagInterface $params)
    {
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
        if($imgName != 'logimg.png'){
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
    public function updateAdminUser(int $id, Request $request, EntityManagerInterface $entityManager, MailerInterface $mailer, JWTTokenManagerInterface $JWTManager, ParameterBagInterface $params, UserPasswordHasherInterface $passwordHasher): Response
    {
        $data = json_decode($request->request->get('data'), true);
        $file = $request->files->get('file');

        $user = $entityManager->getRepository(User::class)->find($id);

        if (null === $user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

     
        if (isset($data['username'])) {
            $existingUser = $entityManager->getRepository(User::class)->findOneBy(['username' => $data['username']]);
            if (null !== $existingUser && $existingUser->getId() !== $user->getId()) {
                return $this->json(['message' => 'Username already exists'], Response::HTTP_CONFLICT);
            }
            $user->setUsername($data['username']);
        }

  
        if (isset($data['role'])) {
            $newRole = is_array($data['role']) ? $data['role'] : [$data['role']];
            if ($newRole !== $user->getRoles()) {
                $user->setRoles($newRole);
            }
        }
        
      
        if (isset($data['firstname'])) {
            $user->setFirstname($data['firstname']);
        }

   
        if (isset($data['lastname'])) {
            $user->setLastname($data['lastname']);
        }

  
        if (isset($data['email'])) {
            $existingEmail = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if (null !== $existingEmail && $existingEmail->getId() !== $user->getId()) {
                return $this->json(['message' => 'Email already exists'], Response::HTTP_CONFLICT);
            }
            $user->setEmail($data['email']);
        }

     
        if (isset($data['photo']) && !$file) {
            $photo = $user->getPhoto();
            if ($photo == 'logimg.png' ) {
            } elseif ($data['photo'] === 'logimg.png' ) {
                    if (file_exists($this->getParameter('kernel.project_dir') . '/public/assets/' . $photo)) {
                        unlink($this->getParameter('kernel.project_dir') . '/public/assets/' . $photo);
                    }
                $user->setPhoto($data['photo']);
            }
        } elseif ($file) {
            $oldPhoto = $user->getPhoto();
            if ($oldPhoto && $oldPhoto !== 'logimg.png') {
                if (file_exists($this->getParameter('kernel.project_dir') . '/public/assets/' . $oldPhoto)) {
                    unlink($this->getParameter('kernel.project_dir') . '/public/assets/' . $oldPhoto);
                }
            }
            $extension = $file->guessExtension();
            $newFilename = uniqid() . '.' . $extension;
            $file->move($this->getParameter('kernel.project_dir') . '/public/assets', $newFilename);
            $user->setPhoto($newFilename);
        }

  
        if (isset($data['password']) && !empty($data['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        }

        if(isset($data['regenerateToken']) && $data['regenerateToken'] === true){
            $token = $JWTManager->create($user);

        $user->setTokenPassword($token);

     
        $appUrl = rtrim($this->params->get('APP_URL'), '/');
        $resetLink = sprintf('%s/resetpassword/%s', $appUrl, $token);


        $emailMessage = (new Email())
            ->from('noreply@votredomaine.com')
            ->to($data['email'])
            ->subject('Réinitialisation du mot de passe')
            ->html(
                $this->renderView(
                    'email/email_reset.html.twig',
                    ['resetLink' => $resetLink,
                    'APP_URL' => $appUrl]
                )
                );

        
        try {
            $mailer->send($emailMessage);
        }
        catch (\Exception $e) {
            return $this->json(['message' => 'Failed to send email', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    if(isset($data['regenerateemaillink']) && $data['regenerateemaillink'] === true && $user->isEmailverify() === false){
        $confirmationToken = Uuid::v4()->toRfc4122();
        $user->setEmaillink($confirmationToken);
        $appUrl = $this->params->get('APP_URL');
        $verificationLink = $appUrl . '/verify-email/' . $confirmationToken;

  
        $emailMessage = (new Email())
            ->from('no-reply@example.com')
            ->to($data['email'])
            ->subject('Bienvenue sur notre Plan It')
            ->html(
            $this->renderView(
                'email/email_verify2.html.twig',
                ['verificationLink' => $verificationLink,
                'APP_URL' => $appUrl]
            )
            );

        $mailer->send($emailMessage);
    }

        if (isset($data['disable'])) {
            if ($data['disable'] === true) {
                $user->setDeletedat(new DateTime());
            } elseif ($data['disable'] === false) {
                $user->setDeletedat(null);
            }
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'User updated successfully'], Response::HTTP_OK);
    }



    #[Route('/admin/events/{id}', name: 'app_events_get', methods: ['GET'])]
    public function getAdminEvent(int $id, EntityManagerInterface $entityManager): Response
    {
        $event = $entityManager->getRepository(Event::class)->find($id);

        if (null === $event) {
            return $this->json(['message' => 'event not found'], Response::HTTP_NOT_FOUND);
        }
        $disable = $event->getDeletedDate() !== null;
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
                'img' => $event->getImg(),
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

        
        if (isset($data['title'])) {
            $event->setTitle($data['title']);
        }

   
        if (isset($data['description'])) {
            $event->setDescription($data['description']);
        }


        if (isset($data['datestart'])) {
            $event->setDatestart(new DateTime($data['datestart']));
        }

     
        if (isset($data['dateend'])) {
            $event->setDateend(new DateTime($data['dateend']));
        }

  
        if (isset($data['location'])) {
            $event->setLocation($data['location']);
        }

   
        if (isset($data['visibility'])) {
            $event->setVisibility($data['visibility']);
        }

     
        if (isset($data['maxparticipants'])) {
            $event->setMaxparticipant($data['maxparticipants']);
        }

       
        if (isset($data['img']) && !$file) {
            $img = $event->getImg();
            if ($img == 'event-background-desktop.png') {
            } elseif ($data['img'] === 'event-background-desktop.png') {
                if ($img != 'event-background-desktop.png') {
                    if (file_exists($this->getParameter('kernel.project_dir') . '/public/assets/' . $img)) {
                        unlink($this->getParameter('kernel.project_dir') . '/public/assets/' . $img);
                    }
                }
                $event->setImg($data['img']);
            }
        } elseif ($file) {
            $oldPhoto = $event->getImg();
            if ($oldPhoto && $oldPhoto !== 'event-background-desktop.png') {
                if (file_exists($this->getParameter('kernel.project_dir') . '/public/assets/' . $oldPhoto)) {
                    unlink($this->getParameter('kernel.project_dir') . '/public/assets/' . $oldPhoto);
                }
            }
        
           
            $extension = $file->guessExtension();
            $newFilename = uniqid() . '.' . $extension;
            
            $file->move($this->getParameter('kernel.project_dir') . '/public/assets', $newFilename);
            
    
            $event->setImg($newFilename);
            
        }

    if   (isset($data['disable'])) {
                if ($data['disable'] === true) {
                    $event->setDeletedDate(new DateTime());
                } elseif ($data['disable'] === false) {
                    $event->setDeletedDate(null);
                }
            }
            
            
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

 
    $userEvents = $entityManager->getRepository(UserEvent::class)->findBy(['event' => $event]);
    foreach ($userEvents as $userEvent) {
        $entityManager->remove($userEvent);
    }

   
    $userInvitations = $entityManager->getRepository(UserInvitation::class)->findBy(['event' => $event]);
    foreach ($userInvitations as $userInvitation) {
        $entityManager->remove($userInvitation);
    }


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

  
    $userEvents = $entityManager->getRepository(UserEvent::class)->findBy(['user' => $user]);
    foreach ($userEvents as $userEvent) {
        $entityManager->remove($userEvent);
    }

  
    $userInvitations = $entityManager->getRepository(UserInvitation::class)->findBy(['user_id' => $user]);
    foreach ($userInvitations as $userInvitation) {
        $entityManager->remove($userInvitation);
    }

   
    $entityManager->remove($user);
    $entityManager->flush();

    return $this->json(['message' => 'User, related user events, and user invitations deleted successfully'], Response::HTTP_OK);
}
}