import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CGUPage() {
    return (
        <div className="gap-20 py-20 mt-20 flex flex-col items-center justify-center">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-left">
                        Conditions Générales d'Utilisation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full rounded-md border p-8 max-h-[70vh]">
                        <div className="space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">1. Objet</h2>
                                <p className="text-muted-foreground">
                                    Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de
                                    l'application web et de son API. En utilisant notre service, vous acceptez ces termes dans
                                    leur intégralité.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">2. Services Proposés</h2>
                                <p className="text-muted-foreground">
                                    Notre application permet aux utilisateurs :
                                    <ul className="list-disc pl-6">
                                        <li>De créer un compte, se connecter et gérer leur profil.</li>
                                        <li>De créer, modifier, visualiser et gérer des événements.</li>
                                        <li>De téléverser des fichiers, tels que des images de profil ou des visuels d’événements.</li>
                                    </ul>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">3. Compte Utilisateur</h2>
                                <p className="text-muted-foreground">
                                    - L'accès à certaines fonctionnalités nécessite la création d'un compte. <br />
                                    - L'utilisateur s'engage à fournir des informations exactes et à ne pas partager ses
                                    identifiants. <br />
                                    - La vérification par email est obligatoire pour valider l'inscription.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">4. Gestion des Événements</h2>
                                <p className="text-muted-foreground">
                                    Les événements créés peuvent être publics ou privés. L'utilisateur est responsable des
                                    informations qu'il publie et garantit leur conformité aux lois en vigueur.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">5. Responsabilités</h2>
                                <p className="text-muted-foreground">
                                    L'utilisateur s'engage à utiliser l'application de manière légale et à ne pas compromettre
                                    la sécurité ou l'intégrité du service. Le prestataire décline toute responsabilité en cas de
                                    perte de données due à un usage inapproprié ou des circonstances extérieures.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">6. Protection des Données</h2>
                                <p className="text-muted-foreground">
                                    L'application respecte les dispositions du <strong>Règlement Général sur la Protection des
                                        Données (RGPD)</strong>. Consultez notre Politique de Confidentialité pour plus
                                    d'informations.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">7. Résiliation</h2>
                                <p className="text-muted-foreground">
                                    - Les utilisateurs peuvent résilier leur compte à tout moment. <br />
                                    - L'application se réserve le droit de suspendre ou résilier tout compte en cas de
                                    non-respect des présentes CGU.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">8. Modification des CGU</h2>
                                <p className="text-muted-foreground">
                                    Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés des
                                    modifications par email ou via l'application.
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
    );
}
