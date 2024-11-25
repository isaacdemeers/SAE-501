import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="gap-20 py-20 mt-20 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
                <div>
                    <div className="text-3xl font-bold text-left">
                        Politique de Confidentialité
                    </div>
                </div>
                <div>
                    <div className="w-full rounded-md border mt-8 p-8 ">
                        <div className="space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                                <p className="text-muted-foreground">
                                    Nous attachons une grande importance à la confidentialité de vos données personnelles.
                                    Cette politique de confidentialité explique comment vos données sont collectées, utilisées
                                    et protégées dans le cadre de notre application.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">2. Données Collectées</h2>
                                <div className="text-muted-foreground">
                                    Les données que nous collectons incluent :
                                    <ul className="list-disc pl-6">
                                        <li><strong>Données d'inscription :</strong> nom, adresse e-mail, mot de passe.</li>
                                        <li><strong>Données d'événements :</strong> titres, descriptions, lieux, images, etc.</li>
                                        <li><strong>Données techniques :</strong> adresse IP, type de navigateur, données de
                                            connexion.</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">3. Utilisation des Données</h2>
                                <div className="text-muted-foreground">
                                    Les données collectées sont utilisées pour :
                                    <ul className="list-disc pl-6">
                                        <li>Fournir et améliorer nos services.</li>
                                        <li>Gérer les comptes et les événements créés par les utilisateurs.</li>
                                        <li>Garantir la sécurité et le bon fonctionnement de l'application.</li>
                                        <li>Envoyer des notifications et communications importantes.</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">4. Partage des Données</h2>
                                <div className="text-muted-foreground">
                                    Vos données personnelles ne sont jamais vendues à des tiers. Cependant, elles peuvent être
                                    partagées avec :
                                    <ul className="list-disc pl-6">
                                        <li>Fournisseurs tiers pour le stockage des fichiers (ex. : AWS S3).</li>
                                        <li>Partenaires techniques pour le traitement des données.</li>
                                        <li>Autorités légales en cas d'obligation légale.</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">5. Sécurité des Données</h2>
                                <p className="text-muted-foreground">
                                    Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger
                                    vos données contre tout accès non autorisé, perte ou destruction. Cela inclut l'utilisation
                                    de protocoles de chiffrement et de pare-feu.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">6. Droits des Utilisateurs</h2>
                                <div className="text-muted-foreground">
                                    En conformité avec le RGPD, vous disposez des droits suivants :
                                    <ul className="list-disc pl-6">
                                        <li><strong>Droit d'accès :</strong> demander l'accès à vos données personnelles.</li>
                                        <li><strong>Droit de rectification :</strong> corriger les données incorrectes ou
                                            incomplètes.</li>
                                        <li><strong>Droit de suppression :</strong> demander la suppression de vos données.</li>
                                        <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données.</li>
                                        <li><strong>Droit de portabilité :</strong> recevoir vos données dans un format
                                            structuré.</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">7. Modifications</h2>
                                <p className="text-muted-foreground">
                                    Nous nous réservons le droit de modifier cette politique à tout moment. Les modifications
                                    seront communiquées via l'application ou par email.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
                                <p className="text-muted-foreground">
                                    Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, veuillez nous contacter à :
                                    <strong> privacy@planit.com</strong>.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <Button>
                <Link href="/" className="flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à l'accueil
                </Link>
            </Button>
        </div>
    );
}
