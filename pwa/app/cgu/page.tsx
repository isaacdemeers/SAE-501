import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CGUPage() {
    return (
        <div className=" gap-20 py-20 mt-20 flex flex-col items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-left">
                        Conditions Générales d'Utilisation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full rounded-md border p-8">
                        <div className="space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                                <p className="text-muted-foreground">
                                    Les présentes conditions générales d'utilisation régissent l'utilisation de notre service...
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">2. Définitions</h2>
                                <p className="text-muted-foreground">
                                    Dans les présentes conditions générales d'utilisation, les termes suivants ont la signification qui leur est donnée ci-après...
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">3. Accès au service</h2>
                                <p className="text-muted-foreground">
                                    L'accès à notre service est soumis aux présentes conditions...
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">4. Propriété intellectuelle</h2>
                                <p className="text-muted-foreground">
                                    Tous les droits de propriété intellectuelle relatifs au service sont la propriété exclusive...
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">5. Protection des données</h2>
                                <p className="text-muted-foreground">
                                    Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité...
                                </p>
                            </section>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Button>
                <Link href="/" className="flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à l'accueil
                </Link>
            </Button>
        </div>
    )
}
