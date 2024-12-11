<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Patch;
use App\Controller\EventController;
use App\Controller\UserEventController;
use App\Controller\AdminController;
use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EventRepository::class)]
#[ApiResource(
    operations: [
        new Post(),
        new Put(),
        new Get(),
        new GetCollection(),
        new Delete(
            uriTemplate: '/events/{id}',
            controller: AdminController::class . '::deleteAdminEvent',
            normalizationContext: ['groups' => ['event:read']],
        ),
        new Get(
            uriTemplate: '/events/{id}',
            controller: EventController::class . '::getEvent',
            normalizationContext: ['groups' => ['event:read']]
        ),
        new Get(
            uriTemplate: '/events/{id}',
            controller: EventController::class . '::getEvent',
            normalizationContext: ['groups' => ['event:read']]
        ),
        new Get(
            uriTemplate: '/events',
            controller: EventController::class . '::getAllEvents',
            normalizationContext: ['groups' => ['event:read']]
        ),
        new Post(
            uriTemplate: '/events',
            controller: EventController::class . '::createEvent',
            normalizationContext: ['groups' => ['event:create']],
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'title' => [
                                        'type' => 'string',
                                        'example' => 'Event Title'
                                    ],
                                    'description' => [
                                        'type' => 'string',
                                        'example' => 'Event Description'
                                    ],
                                    'datestart' => [
                                        'type' => 'string',
                                        'format' => 'date-time',
                                        'example' => '2023-01-01T00:00:00Z'
                                    ],
                                    'dateend' => [
                                        'type' => 'string',
                                        'format' => 'date-time',
                                        'example' => '2023-01-01T23:59:59Z'
                                    ],
                                    'location' => [
                                        'type' => 'string',
                                        'example' => 'Event Location'
                                    ],
                                    'visibility' => [
                                        'type' => 'boolean',
                                        'example' => true
                                    ],
                                    'maxparticipant' => [
                                        'type' => 'integer',
                                        'example' => 100
                                    ],
                                    'img' => [
                                        'type' => 'string',
                                        'example' => 'image.jpg'
                                    ]
                                ],
                                'required' => ['title', 'description', 'datestart', 'dateend', 'location', 'visibility', 'sharelink', 'maxparticipant', 'img']
                            ]
                        ]
                    ]
                ]
            ]
        ),
        new Post(
            uriTemplate: '/events/{id}',
            controller: EventController::class . '::editEvent',
            normalizationContext: ['groups' => ['event:edit']],
            openapiContext: [
                'summary' => 'Edit an event',
                'requestBody' => [
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'title' => [
                                        'type' => 'string',
                                        'example' => 'Updated Event Title'
                                    ],
                                    'description' => [
                                        'type' => 'string',
                                        'example' => 'Updated Event Description'
                                    ],
                                    'datestart' => [
                                        'type' => 'string',
                                        'format' => 'date-time',
                                        'example' => '2024-01-01T00:00:00Z'
                                    ],
                                    'dateend' => [
                                        'type' => 'string',
                                        'format' => 'date-time',
                                        'example' => '2024-01-01T23:59:59Z'
                                    ],
                                    'location' => [
                                        'type' => 'string',
                                        'example' => 'Updated Location'
                                    ],
                                    'visibility' => [
                                        'type' => 'string',
                                        'enum' => ['public', 'private'],
                                        'example' => 'public'
                                    ],
                                    'maxparticipant' => [
                                        'type' => 'integer',
                                        'example' => 150
                                    ]
                                ]
                            ]
                        ],
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'img' => [
                                        'type' => 'string',
                                        'format' => 'binary'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ),
        new Get(
            uriTemplate: '/events/{id}/admin',
            controller: EventController::class . '::getEventAdmin',
            normalizationContext: ['groups' => ['event:read']],
            openapiContext: [
                'summary' => 'Récupère l\'administrateur d\'un événement',
                'description' => 'Retourne l\'ID et l\'email de l\'administrateur de l\'événement',
                'responses' => [
                    '200' => [
                        'description' => 'Administrateur trouvé',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'admin' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'id' => ['type' => 'integer'],
                                                'email' => ['type' => 'string']
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    '404' => [
                        'description' => 'Événement ou administrateur non trouvé'
                    ]
                ]
            ]
        ),
        new GetCollection(
            uriTemplate: '/events/{id}/users',
            controller: UserEventController::class . '::getEventUsers',
            read: false,
            deserialize: false,
            paginationEnabled: false,
            openapiContext: [
                'summary' => 'Récupère tous les utilisateurs d\'un événement',
                'parameters' => [
                    [
                        'name' => 'id',
                        'in' => 'path',
                        'required' => true,
                        'schema' => [
                            'type' => 'integer'
                        ]
                    ]
                ]
            ],
            provider: null
        ),
        new Delete(
            uriTemplate: '/events/{eventId}/users/{userId}',
            controller: EventController::class . '::removeUserFromEvent',
            read: false,
            deserialize: false,
            openapiContext: [
                'summary' => 'Retire un utilisateur d\'un événement',
                'description' => 'Supprime un utilisateur d\'un événement (sauf l\'administrateur)',
                'parameters' => [
                    [
                        'name' => 'eventId',
                        'in' => 'path',
                        'required' => true,
                        'schema' => [
                            'type' => 'integer'
                        ]
                    ],
                    [
                        'name' => 'userId',
                        'in' => 'path',
                        'required' => true,
                        'schema' => [
                            'type' => 'integer'
                        ]
                    ]
                ],
                'responses' => [
                    '200' => [
                        'description' => 'Utilisateur retiré avec succès'
                    ],
                    '403' => [
                        'description' => 'Impossible de supprimer l\'administrateur'
                    ],
                    '404' => [
                        'description' => 'Utilisateur ou événement non trouvé'
                    ]
                ]
            ],
            provider: null
        )
    ]

)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['event:read', 'event:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['event:read', 'event:write', 'event:create'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['event:read', 'event:write', 'event:create'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['event:read', 'event:write', 'event:create'])]
    private ?\DateTimeInterface $datestart = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['event:read', 'event:write', 'event:create'])]
    private ?\DateTimeInterface $dateend = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['event:read', 'event:write', 'event:create'])]
    private ?string $location = null;

    #[ORM\Column(length: 255)]
    #[Groups(['event:read', 'event:write', 'event:create'])]
    private ?string $sharelink = null;

    #[ORM\Column(length: 255)]
    #[Groups(['event:read', 'event:write', 'event:create'])]
    private ?string $img = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['event:read', 'event:write'])]
    private ?\DateTimeInterface $deleted_date = null;

    #[ORM\Column]
    #[Groups(['event:read', 'event:write'])]

    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(['event:read', 'event:write'])]

    private ?int $visibility = null;

    #[ORM\Column]
    #[Groups(['event:read', 'event:write', 'event:create'])]
    private ?int $maxparticipant = null;


    #[ORM\OneToMany(mappedBy: 'event', targetEntity: UserEvent::class)]
    private Collection $userevents;

    public function __construct()
    {
        $this->userevents = new ArrayCollection();
    }

    /**
     * @return Collection<int, UserEvent>
     */
    public function getUserevents(): Collection
    {
        return $this->userevents;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDatestart(): ?\DateTimeInterface
    {
        return $this->datestart;
    }

    public function setDatestart(\DateTimeInterface $datestart): static
    {
        $this->datestart = $datestart;

        return $this;
    }

    public function getDateend(): ?\DateTimeInterface
    {
        return $this->dateend;
    }

    public function setDateend(\DateTimeInterface $dateend): static
    {
        $this->dateend = $dateend;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getSharelink(): ?string
    {
        return $this->sharelink;
    }

    public function setSharelink(string $sharelink): static
    {
        $this->sharelink = $sharelink;

        return $this;
    }

    public function getImg(): ?string
    {
        return $this->img;
    }

    public function setImg(string $img): static
    {
        $this->img = $img;

        return $this;
    }

    public function getDeletedDate(): ?\DateTimeInterface
    {
        return $this->deleted_date;
    }

    public function setDeletedDate(?\DateTimeInterface $deleted_date): static
    {
        $this->deleted_date = $deleted_date;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getVisibility(): ?int
    {
        return $this->visibility;
    }

    public function setVisibility(int $visibility): static
    {
        $this->visibility = $visibility;

        return $this;
    }

    public function getMaxparticipant(): ?int
    {
        return $this->maxparticipant;
    }

    public function setMaxparticipant(int $maxparticipant): static
    {
        $this->maxparticipant = $maxparticipant;

        return $this;
    }
}
