import { useEffect } from 'react';
import { useRouter } from 'next/router';

const VerifyEmailPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/404');
    }, [router]);

    return null;
};

export default VerifyEmailPage;