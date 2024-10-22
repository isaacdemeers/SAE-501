<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Controller\RegisterController;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['user:read']]),
        new POST(
            uriTemplate: '/users/testemail',
            controller: RegisterController::class . '::checkEmail', 
            denormalizationContext:['groups' => ['user:emailverification']],
            security: "is_granted('ROLE_ADMIN')",

        ),
        new Get(
            uriTemplate: '/verify-email/{emaillink}', 
            controller: RegisterController::class . '::verifyEmail', 
            read: false, 
            normalizationContext: ['groups' => ['user:emailconfirmation']],
            write: true,
            name: 'emaillink'
        ),
        new Post(
            uriTemplate: '/register',
            controller: RegisterController::class,
            denormalizationContext: ['groups' => ['user:create']]
        ),
        new Put(denormalizationContext: ['groups' => ['user:write']]),
        new Delete()
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public function __construct()
    {
        $this->setRoles(['ROLE_USER']); 
        $this->setPhoto('/public/logimg.png'); 
        $this->setEmailverify(false); 
    }
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['user:read', 'user:create' , 'user:emailverification'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private array $roles = [];

    #[ORM\Column]
    #[Groups(['user:read' , 'user:create'])]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read' , 'user:create'])]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read'  ,'user:create'])]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read'  , 'user:create'])]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read'])]
    private ?string $photo = null;

    #[ORM\Column]
    #[Groups(['user:read', ])]
    private ?bool $emailverify = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read' ,'user:create' , 'user:emailconfirmation'])]
    private ?string $emaillink = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function eraseCredentials(): void
    {
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(string $photo): static
    {
        $this->photo = $photo;

        return $this;
    }

    public function isEmailverify(): ?bool
    {
        return $this->emailverify;
    }

    public function setEmailverify(bool $emailverify): static
    {
        $this->emailverify = $emailverify;

        return $this;
    }

    public function getEmaillink(): ?string
    {
        return $this->emaillink;
    }

    public function setEmaillink(string $emaillink): static
    {
        $this->emaillink = $emaillink;

        return $this;
    }
}
