import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CGUPage() {
    return (
        <div className="gap-20 py-20 mt-20 flex flex-col items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-left">
                        Politique de Confidentialité - PlanIt
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full rounded-md border p-8">
                        <div className="space-y-8">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">1. Collecte des Données</h2>
                                <p className="text-muted-foreground">
                                    PlanIt collecte uniquement les données nécessaires à son fonctionnement :
                                </p>
                                <ul className="list-disc ml-6 mt-2 space-y-2 text-muted-foreground">
                                    <li>Informations de profil (nom, email)</li>
                                    <li>Données de calendrier et événements</li>
                                    <li>Préférences de notification</li>
                                    <li>Informations de connexion</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">2. Utilisation des Données</h2>
                                <p className="text-muted-foreground">
                                    Vos données sont utilisées pour :
                                </p>
                                <ul className="list-disc ml-6 mt-2 space-y-2 text-muted-foreground">
                                    <li>Gérer votre compte et vos événements</li>
                                    <li>Améliorer nos services</li>
                                    <li>Vous envoyer des notifications importantes</li>
                                    <li>Assurer la sécurité de votre compte</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">3. Protection des Données</h2>
                                <p className="text-muted-foreground">
                                    Nous mettons en œuvre des mesures de sécurité pour protéger vos données :
                                </p>
                                <ul className="list-disc ml-6 mt-2 space-y-2 text-muted-foreground">
                                    <li>Chiffrement des données sensibles</li>
                                    <li>Accès restreint aux données personnelles</li>
                                    <li>Sauvegardes régulières</li>
                                    <li>Mise à jour des systèmes de sécurité</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">4. Vos Droits</h2>
                                <p className="text-muted-foreground">
                                    Conformément au RGPD, vous disposez des droits suivants :
                                </p>
                                <ul className="list-disc ml-6 mt-2 space-y-2 text-muted-foreground">
                                    <li>Droit d'accès à vos données</li>
                                    <li>Droit de rectification</li>
                                    <li>Droit à l'effacement</li>
                                    <li>Droit à la portabilité des données</li>
                                    <li>Droit d'opposition au traitement</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
                                <p className="text-muted-foreground">
                                    PlanIt utilise des cookies essentiels pour :
                                </p>
                                <ul className="list-disc ml-6 mt-2 space-y-2 text-muted-foreground">
                                    <li>Maintenir votre session</li>
                                    <li>Mémoriser vos préférences</li>
                                    <li>Assurer la sécurité de votre compte</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">6. Contact</h2>
                                <p className="text-muted-foreground">
                                    Pour toute question concernant vos données personnelles, contactez-nous à :
                                    <br />
                                    <a href="mailto:privacy@planit.fr" className="text-blue-600 hover:underline">
                                        privacy@planit.fr
                                    </a>
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
