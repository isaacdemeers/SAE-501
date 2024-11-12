<?php
namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Uid\Uuid;

class RegisterProcessor implements ProcessorInterface
{
    private $entityManager;
    private $passwordHasher;
    private $mailer;
    private $urlGenerator;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        MailerInterface $mailer,
        UrlGeneratorInterface $urlGenerator
    ) {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->mailer = $mailer;
        $this->urlGenerator = $urlGenerator;
    }

    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($data instanceof User) {
            // Hachage du mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword($data, $data->getPassword());
            $data->setPassword($hashedPassword);

            // Génération du token de confirmation d'email
            $confirmationToken = Uuid::v4()->toRfc4122();
            $data->setEmaillink($confirmationToken);

            // Sauvegarde de l'utilisateur
            $this->entityManager->persist($data);
            $this->entityManager->flush();

            // Génération du lien de vérification
            $verificationLink = $this->urlGenerator->generate('app_confirm_email', [
                'token' => $confirmationToken,
            ], UrlGeneratorInterface::ABSOLUTE_URL);

            // Envoi de l'email de confirmation
            $email = (new Email())
                ->from('no-reply@example.com')
                ->to($data->getEmail())
                ->subject('Please Confirm your Email')
                ->html('<p>Please confirm your email by clicking on the following link: <a href="' . $verificationLink . '">Verify Email</a></p>');

            $this->mailer->send($email);
        }
    }
}