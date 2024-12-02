<?php

namespace App\Repository;

use App\Entity\UserEvent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use DateTime;

/**
 * @extends ServiceEntityRepository<UserEvent>
 */
class UserEventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserEvent::class);
    }

    public function findUpcomingEvents(int $userId, DateTime $currentDate)
    {
        return $this->createQueryBuilder('ue')
            ->join('ue.event', 'e')
            ->where('ue.user = :userId')
            ->andWhere('e.dateend >= :currentDate')
            ->setParameter('userId', $userId)
            ->setParameter('currentDate', $currentDate)
            ->orderBy('e.datestart', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findEventAdmin(int $eventId): ?UserEvent
    {
        return $this->createQueryBuilder('ue')
            ->andWhere('ue.event = :eventId')
            ->andWhere('ue.role = :role')
            ->setParameter('eventId', $eventId)
            ->setParameter('role', 'ROLE_ADMIN')
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findEventUsers(int $eventId): array
    {
        return $this->createQueryBuilder('ue')
            ->select('ue, u')
            ->join('ue.user', 'u')
            ->where('ue.event = :eventId')
            ->setParameter('eventId', $eventId)
            ->orderBy('ue.role', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }
}
