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
}
