<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Controller\RegisterController;
use App\Controller\ResetPasswordController;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_USERNAME', fields: ['username'])]
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/users',
            security: "is_granted('ROLE_ADMIN')",
            normalizationContext: ['groups' => ['user:read', 'user:admin:read']]
        ),
        new Get(
            security: "is_granted('ROLE_ADMIN')",
            normalizationContext: ['groups' => ['user:read', 'user:admin:read']]
        ),
        new POST(
            uriTemplate: '/users/testemail',
            controller: RegisterController::class . '::checkEmail',
            denormalizationContext: ['groups' => ['user:emailverification']],
        ),
        new POST(
            uriTemplate: '/users/testusername',
            controller: RegisterController::class . '::checkUsername',
            denormalizationContext: ['groups' => ['user:usernameverification']],

        ),
        new Post(
            uriTemplate: '/verify-email',
            controller: RegisterController::class . '::verifyEmail',
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'emailtoken' => [
                                        'type' => 'string',
                                        'example' => 'some-verification-token'
                                    ]
                                ],
                                'required' => ['token']
                            ]
                        ]
                    ]
                ]
            ],
        ),
        new Post(
            uriTemplate: '/register',
            controller: RegisterController::class,
            normalizationContext: ['groups' => ['user:create']],
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'email' => [
                                        'type' => 'string',
                                        'example' => 'user@example.com'
                                    ],
                                    'password' => [
                                        'type' => 'string',
                                        'example' => 'password123'
                                    ],
                                    'firstname' => [
                                        'type' => 'string',
                                        'example' => 'John'
                                    ],
                                    'lastname' => [
                                        'type' => 'string',
                                        'example' => 'Doe'
                                    ],
                                    'username' => [
                                        'type' => 'string',
                                        'example' => 'johndoe'
                                    ]
                                ],
                                'required' => ['email', 'password', 'firstname', 'lastname', 'username']
                            ]
                        ]
                    ]
                ]
            ]
        ),
        new Post(
            uriTemplate: "/reset/passwordemail",
            controller: ResetPasswordController::class . '::resetPasswordEmail',
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'email' => [
                                        'type' => 'string',
                                        'example' => 'user@example.com'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ),
        new POST(
            uriTemplate: '/reset/password',
            controller: ResetPasswordController::class . '::resetPassword',
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'token' => [
                                        'type' => 'string',
                                        'example' => 'some-reset-token'
                                    ],
                                    'newPassword' => [
                                        'type' => 'string',
                                        'example' => 'newpassword123'
                                    ]
                                ],
                                'required' => ['token', 'newPassword']
                            ]
                        ]
                    ]
                ]
            ]
        ),
        new Put(denormalizationContext: ['groups' => ['user:write']]),
        new Delete(),
        new Put(
            normalizationContext: ['groups' => ['user:read', 'user:admin:read']],
            denormalizationContext: ['groups' => ['user:write', 'user:admin:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        )
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public function __construct()
    {
        $this->setRoles(['ROLE_USER']);
        $this->setEmailverify(false);
    }
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read', 'user:admin:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['user:read', 'user:create', 'user:emailverification', 'user:emailresetpassword', 'user:admin:read', 'user:admin:write'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['user:read', 'user:admin:read', 'user:admin:write'])]
    private array $roles = [];

    #[ORM\Column]
    #[Groups(['user:create', 'user:admin:write'])]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:create', 'user:admin:read', 'user:admin:write'])]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:create', 'user:admin:read', 'user:admin:write'])]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:create', 'user:usernameverification', 'user:admin:read', 'user:admin:write'])]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read'])]
    private ?string $photo = null;

    #[ORM\Column]
    #[Groups(['user:read',])]
    private ?bool $emailverify = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:create', 'user:emailconfirmation'])]
    private ?string $emaillink = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['user:read', 'user:create'])]
    private ?string $tokenpassword = null;



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

    public function eraseCredentials(): void {}

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

    public function getTokenpassword(): ?string
    {
        return $this->tokenpassword;
    }

    public function setTokenpassword(?string $tokenpassword): static
    {
        $this->tokenpassword = $tokenpassword;

        return $this;
    }
}
