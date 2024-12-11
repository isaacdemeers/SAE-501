"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Loader() {
    const [isLoading, setIsLoading] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        setIsLoading(true);
        setShouldRender(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => {
                setShouldRender(false);
            }, 300); // Même durée que la transition
        }, 300);

        return () => clearTimeout(timer);
    }, [pathname]);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 bg-slate-100 z-50 transition-opacity duration-500 flex items-center justify-center ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" /> */}
        </div>
    );
}