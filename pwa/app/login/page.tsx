'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import LoginForm from "@/components/login/loginForm";
import { IsAuthentificated } from "@/lib/request";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const isAuth = await IsAuthentificated();
            if (isAuth.isValid === true) {
                router.push('/');
            } else {
                setLoading(false); // Arrêtez le loader si non authentifié
            }
        }
        checkAuth();
    }, [router]);

    if (loading) {
        return <div>Loading...</div>; // Loader temporaire
    }

    return (
        <div className="w-full h-full flex items-center justify-center p-10">
            <LoginForm />
        </div>
    );
}
