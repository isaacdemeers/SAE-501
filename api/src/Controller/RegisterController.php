<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class RegisterController extends AbstractController
{
    #[Route('/register', name: 'app_register', methods: ['GET'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): Response
    {
       $user = $entityManager->getRepository(User::class)->findOneBy(['email'=> $request->request->get('email')]);
       if (null === $user) {
           $user = new User();
           var_dump($request->request->get('email'));
           $user->setEmail($request->request->get('email'));
           $user->setPassword($passwordHasher->hashPassword($user, $request->request->get('password')));
           $entityManager->persist($user);
           $entityManager->flush();
           return $this->json(['message' => 'User registered successfully'], Response::HTTP_CREATED);
       }
       return $this->json(['message' => 'User already exists'], Response::HTTP_CONFLICT);
    }
}