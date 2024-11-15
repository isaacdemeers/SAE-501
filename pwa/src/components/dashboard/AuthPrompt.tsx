"use client";

import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function AuthPrompt() {
    return (
        <div className="p-4 bg-slate-50 rounded-xl h-fit lg:sticky top-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Mes événements</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Rejoignez Plan-It</h3>
                <p className="text-gray-600 mb-6">
                    Connectez-vous ou créez un compte pour gérer vos événements et profiter de toutes les fonctionnalités.
                </p>
                <div className="flex flex-col lg:flex-row gap-4">
                    <Link href="/login">
                        <Button className="w-full">
                            Se connecter
                        </Button>
                    </Link>
                    <Link href="/signin">
                        <Button variant="outline" className="w-full">
                            Créer un compte
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 