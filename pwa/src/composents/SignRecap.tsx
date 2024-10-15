import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar , AvatarFallback , AvatarImage } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';
interface SignRecapProps {
        signdata: {
            [key: string]: any;
            image?: File;
        };
        handleRecap: (recap: boolean) => void;
        pushdata: () => void;
    }
    

const SignRecap: React.FC<SignRecapProps> = ({ signdata , handleRecap , pushdata} ) => {
    console.log(signdata);

    return (
        <Card className="w-fit px-10  lg:w-fit">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-center">Account Recap</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center ">
                  {signdata.image ? (
                    <Avatar className="w-32 h-10">
                      <AvatarImage src={URL.createObjectURL(signdata.image)} alt="User Avatar" className="w-32 h-32 rounded-full object-cover" />
                      <AvatarFallback className="bg-navy-200 w-0 text-navy-900 ">
                        <User className="w-16 h-16" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="flex items-center justify-center mb-5">
                      <AvatarFallback className="bg-navy-200 text-navy-900">
                        <User className="w-16 h-16 mr-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="w-full flex flex-col justify-center items-center gap-2">
                <div className='flex flex-col items-center'>
                    <h3 className="font-semibold text-sm md:text-lg text-gray-500">First Name</h3>
                    <p className="text-lg md:text-xl">{signdata.firstname}</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <h3 className="font-semibold text-sm md:text-lg  text-gray-500">Last Name</h3>
                    <p className="text-lg md:text-xl">{signdata.lastname}</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <h3 className="font-semibold text-sm md:text-lg  text-gray-500">Username</h3>
                    <p className="text-lg md:text-xl">{signdata.username}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 px-0 justify-between">
          <Button
            size={"lg"}
            onClick={pushdata}
            className="w-full md:text-lg"
          >
            Create my account
          </Button>
          <Button
            size={"lg"}
            onClick={() => handleRecap(false)}
            className="w-full bg-gray-200 text-black hover:brightness-90 hover:bg-gray-200 md:text-lg"
          >
            Go back
          </Button>
        </CardFooter>
            </Card>
      )
    }

export default SignRecap;