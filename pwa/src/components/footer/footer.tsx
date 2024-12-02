import Link from "next/link"
import { abhayalibre } from '@/lib/fonts'

export default function Footer() {
    return (
        <footer className="bg-navy-900 text-white py-12 px-6 bg-slate-950 ">
            <div className="max-w-6xl mx-auto">
                <h2 className={`mb-8 drop-shadow-lg  text-4xl font-bold text-slate-50 ${abhayalibre.className}`}>PlanIt</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-slate-50">A Propos</h3>
                        <p className="text-slate-50">
                            Organisez, découvrez et participez à des événements en toute simplicité grâce à notre application intuitive et sécurisée.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-slate-50">Contacts</h3>
                        <div className="inline-block border border-gray-600 rounded-md px-3 py-2">
                            <Link href="mailto:help@planit.com" className="flex items-center text-slate-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="white">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                help@planit.com
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-slate-50">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link href="/politique-de-confidentialite" className="hover:underline text-slate-50">Politique de Confidentialité</Link></li>
                            <li><Link href="/cgu" className="hover:underline text-slate-50">Conditions Générales d'Utilisation</Link></li>
                            {/* <li><Link href="/help-support" className="hover:underline text-slate-50">Help & Support</Link></li>
                            <li><Link href="/about-licenses" className="hover:underline text-slate-50">About Licenses</Link></li> */}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 text-center ">
                    <p className="text-slate-50">&copy; Tous droits réservés FLIQ Inc. - 2024©</p>
                </div>
            </div>
        </footer>
    )
}