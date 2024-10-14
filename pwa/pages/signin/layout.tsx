import Image from 'next/image'
import logimg from '@/public/logimg.png'
export default function SigninLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="flex flex-col md:flex-row justify-center items-center md:w-screen md:ml-0 md:h-screen mx-4 mt-16 md:mt-0 h-full bg-white">
        <div className=" hidden lg:flex justify-center items-center w-full md:w-1/2 h-full">
            <Image className="w-full h-full" src={logimg} alt="logo" width={100} height={100}/>
        </div>
        <div className="flex justify-center items-center w-full md:w-3/4">
            {children}
        </div>
    </div>
    );
  }
  