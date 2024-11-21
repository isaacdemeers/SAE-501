<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\UserInvitationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(
    operations: [
        new Get( ),
    ])]
#[ORM\Entity(repositoryClass: UserInvitationRepository::class)]
class UserInvitation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Event $event = null;

    #[ORM\Column(length: 255)]
    private ?string $link = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $expiration = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date_invitation = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_acceptinvitation = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user_id = null;

    #[ORM\ManyToOne]
    private ?User $user_invite = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEvent(): ?Event
    {
        return $this->event;
    }

    public function setEvent(?Event $event): static
    {
        $this->event = $event;

        return $this;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(string $link): static
    {
        $this->link = $link;

        return $this;
    }

    public function getExpiration(): ?\DateTimeInterface
    {
        return $this->expiration;
    }

    public function setExpiration(\DateTimeInterface $expiration): static
    {
        $this->expiration = $expiration;

        return $this;
    }

    public function getDateInvitation(): ?\DateTimeInterface
    {
        return $this->date_invitation;
    }

    public function setDateInvitation(\DateTimeInterface $date_invitation): static
    {
        $this->date_invitation = $date_invitation;

        return $this;
    }

    public function getDateAcceptinvitation(): ?\DateTimeInterface
    {
        return $this->date_acceptinvitation;
    }

    public function setDateAcceptinvitation(?\DateTimeInterface $date_acceptinvitation): static
    {
        $this->date_acceptinvitation = $date_acceptinvitation;

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->user_id;
    }

    public function setUserId(?User $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getUserInvite(): ?User
    {
        return $this->user_invite;
    }

    public function setUserInvite(?User $user_invite): static
    {
        $this->user_invite = $user_invite;

        return $this;
    }
}
