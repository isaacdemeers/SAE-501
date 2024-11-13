<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Controller\EventController;
use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EventRepository::class)]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['event:read']]),
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
        )
    ]
)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['event:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['event:read', 'event:create'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['event:read', 'event:create'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['event:read', 'event:create'])]
    private ?\DateTimeInterface $datestart = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['event:read', 'event:create'])]
    private ?\DateTimeInterface $dateend = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['event:read', 'event:create'])]
    private ?string $location = null;

    #[ORM\Column]
    #[Groups(['event:read', 'event:create'])]
    private ?bool $visibility = null;

    #[ORM\Column(length: 255)]
    #[Groups(['event:read', 'event:create'])]
    private ?string $sharelink = null;

    #[ORM\Column(type: Types::BIGINT)]
    #[Groups(['event:read', 'event:create'])]
    private ?string $maxparticipant = null;

    #[ORM\Column(length: 255)]
    #[Groups(['event:read', 'event:create'])]
    private ?string $img = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['event:read'])]
    private ?\DateTimeInterface $deleted_date = null;

   

 

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

    public function isVisibility(): ?bool
    {
        return $this->visibility;
    }

    public function setVisibility(bool $visibility): static
    {
        $this->visibility = $visibility;

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

    public function getMaxparticipant(): ?string
    {
        return $this->maxparticipant;
    }

    public function setMaxparticipant(string $maxparticipant): static
    {
        $this->maxparticipant = $maxparticipant;

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

}