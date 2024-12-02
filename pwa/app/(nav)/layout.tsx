'use client'

import Header from "@/components/header/header";

export default function NavLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col flex-grow">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}

