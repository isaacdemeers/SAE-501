'use client'
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react";
import VerifyEmail from "@/components/utils/verifyEmail";
import { VerifyEmailToken } from "@/lib/request";

export default function VerifyEmailPage() {
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const pathname = usePathname();

    useEffect(() => {
        const verifyToken = async () => {
            const urltoken = pathname.split('/').pop();
            if (urltoken) {
                const result = await VerifyEmailToken(urltoken);
                if (result.message === "Email verified successfully") {
                    setIsVerified(true);
                } else if (result.message === "Token is missing" || result.message === "Invalid token") {
                    setIsVerified(false);
                }
            }
        };

        verifyToken();
    }, [pathname]);

    return (
        <VerifyEmail isVerified={isVerified} />
    );
};
