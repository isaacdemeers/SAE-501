<?php

namespace App\Repository;

use App\Entity\UserEvent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserEvent>
 */
class UserEventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserEvent::class);
    }

//    /**
//     * @return UserEvent[] Returns an array of UserEvent objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?UserEvent
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

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
