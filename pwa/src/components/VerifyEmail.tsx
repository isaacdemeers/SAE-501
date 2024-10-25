import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

interface EmailVerificationStatusProps {
  isVerified: boolean
}

export default function VerifyEmail({ isVerified }: EmailVerificationStatusProps) {
  return (
    <div className="flex min-h-screen bg-navy-900 items-center justify-center">
      <div className="w-full flex items-center justify-center bg-white p-4">
        <Card className="w-fit border-2 border-black">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
                {isVerified ? "Email vérifié" : "Échec de la vérification"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {isVerified ? (
                <CheckCircle2 className="w-24 h-24 text-green-500" />
              ) : (
                <XCircle className="w-24 h-24 text-red-500" />
              )}
            </div>
            <p className="text-center text-lg">
                {isVerified
                ? `Votre email a été vérifié avec succès.`
                : `Nous n'avons pas pu vérifier votre email.`}
            </p>
            {!isVerified && (
                <p className="text-center text-gray-600">
                Veuillez aller sur votre page de compte et renvoyer un e-mail de vérification.
                </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {isVerified ? (
               <Button
               className="w-full bg-black text-white hover:brightness-90 md:text-lg"
             >
                 <Link href="/">Retour à l'accueil</Link>
             </Button>
            ) : (
              <>
                <Button
                  className="w-full bg-black text-white hover:brightness-90 md:text-lg"
                >
                  <Link href="/">Retour à l'accueil</Link>
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}