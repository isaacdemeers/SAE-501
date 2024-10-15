namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class RegisterController extends AbstractController
{
    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, MailerInterface $mailer, UrlGeneratorInterface $urlGenerator): Response
    {
        $data = json_decode($request->getContent(), true);

        // Vérifier que l'utilisateur n'existe pas déjà
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (null === $user) {
            $user = new User();
            $user->setEmail($data['email']);

            // Hachage du mot de passe
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            // Champs facultatifs
            $user->setFirstname($data['firstname'] ?? 'DefaultFirstname');
            $user->setLastname($data['lastname'] ?? 'DefaultLastname');
            $user->setUsername($data['username'] ?? 'DefaultUsername');

            // Génération du token de confirmation d'email
            $confirmationToken = Uuid::v4()->toRfc4122();
            $user->setEmaillink($confirmationToken);

            $entityManager->persist($user);
            $entityManager->flush();

            // Génération du lien de vérification
            $verificationLink = $urlGenerator->generate('app_confirm_email', [
                'token' => $confirmationToken,
            ], UrlGeneratorInterface::ABSOLUTE_URL);

            // Envoi de l'email de confirmation
            $email = (new Email())
                ->from('no-reply@example.com')
                ->to($user->getEmail())
                ->subject('Please Confirm your Email')
                ->html('<p>Please confirm your email by clicking on the following link: <a href="' . $verificationLink . '">Verify Email</a></p>');

            $mailer->send($email);

            return $this->json($user, Response::HTTP_CREATED);
        }

        return $this->json(['message' => 'User already exists'], Response::HTTP_CONFLICT);
    }

    #[Route('/verify-email', name: 'app_confirm_email', methods: ['GET'])]
    public function verifyEmail(Request $request, EntityManagerInterface $entityManager): Response
    {
        $token = $request->query->get('token');

        if (null === $token) {
            return $this->json(['message' => 'Token is missing'], Response::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['verificationToken' => $token]);

        if (null === $user) {
            return $this->json(['message' => 'Invalid token'], Response::HTTP_BAD_REQUEST);
        }

        $user->setIsVerified(true);
        $user->setVerificationToken(null);
        $entityManager->flush();

        return $this->json(['message' => 'Email verified successfully'], Response::HTTP_OK);
    }
}
