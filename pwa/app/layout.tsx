'use client'

import "../styles/globals.css";
import { Inter } from "next/font/google";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/footer";
import { Metadata } from "next";
import Loader from "@/components/utils/Loader";


const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "PlanIt - Planifier votre prochaine sortie",
  description: "PlanIt est un calendrier partagé pour planifier vos événements.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [cookieStatus, setCookieStatus] = useState(() =>
    typeof window !== "undefined" &&
    localStorage.getItem("cookie-accepted") === "true"
  );

  useEffect(() => {
    if (!cookieStatus) {
      toast({
        title: "Nous utilisons des cookies",
        description:
          "Ce site utilise des cookies pour fonctionner.",
        action: (
          <div className="flex flex-col gap-1">
            <ToastAction
              altText="Accepter"
              onClick={() => handleCookieChoice(true)}
            >
              Fermer
            </ToastAction>
            {/* <ToastAction
              altText="Refuser"
              onClick={() => handleCookieChoice(false)}
            >
              Refuser
            </ToastAction> */}
          </div>
        ),
      });
    }
  }, [cookieStatus, toast]);

  function handleCookieChoice(accepted: boolean) {
    setCookieStatus(true);
    localStorage.setItem("cookie-accepted", accepted ? "true" : "false");
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Loader />

        <div className="min-h-screen flex flex-col">
          {children}
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
