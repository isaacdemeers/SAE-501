'use client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ArrowLeft } from "lucide-react"
interface HandleImageProps {
  handleImageData: (data: File) => void;
  handleBack: () => void;
  signdata: {
    [key: string]: string | number | boolean | File | undefined;
    image?: File;
  };
  handleRecap: () => void;
}

export default function AddImage({ handleImageData, handleBack, handleRecap, signdata }: HandleImageProps): JSX.Element {
  const [sizeerror, setSizeerror] = useState<boolean>(false);
  const [fileok, setFileok] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (signdata.image) {
      setImageSrc(URL.createObjectURL(signdata.image));
    }
  }
    , [signdata.image]);


  const handleuploadimage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        if (width > 800 || height > 800) {
          setSizeerror(true);
          setTimeout(() => {
            setSizeerror(false);
          }, 5000);
          return;
        } else {
          setFileok(true);
          setTimeout(() => {
            setFileok(false);
          }, 5000);
          handleImageData(file);
          setImageSrc(URL.createObjectURL(file));
        }
      };
      img.src = URL.createObjectURL(file);
    }
  }

  const handleSkip = () => {
    handleRecap();
    // signdata.image = undefined;
    setImageSrc(null);
  }

  return (
    <>
      {fileok && (
        <div className="text-green-600 flex items-center rounded-xl mb-6 justify-center bg-green-300 h-12 text-base md:text-lg w-full">
          Votre image a été téléchargée avec succès
        </div>
      )}
      {sizeerror && (
        <div className="text-red-600 flex items-center rounded-xl mb-6 justify-center bg-red-300 h-12 text-base md:text-lg w-full">
          Votre image est trop grande,&nbsp; <a href="https://www.iloveimg.com/resize-image" target="_blank" className="underline font-bold">redimentionner la ici</a>
        </div>
      )}

      <ArrowLeft className="w-10 h-10 text-gray-400 mb-2 cursor-pointer" onClick={() => handleBack()} />
      <Card className="w-full  md:w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Aidez les gens à vous reconnaître</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex flex-col items-center justify-center border-2 border-dashed ${sizeerror ? 'border-red-500' : 'border-gray-300'} rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors relative`}>
            <input onChange={handleuploadimage} type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpg, image/svg" />
            {imageSrc ? (
              <img src={imageSrc} alt="Uploaded" className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  Appuyez pour télécharger une image de profil ou faites glisser une image ici
                  <br />
                  SVG, PNG, or JPG (max. 800x800px)
                </p>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 justify-between">
          <Button
            size={"lg"}
            onClick={() => handleRecap()}
            className="w-full md:text-lg"
          >
            Suivant
          </Button>
          <Button
            size={"lg"}
            onClick={handleSkip}
            className="w-full bg-gray-200 text-black hover:brightness-90 hover:bg-gray-200 md:text-lg"
          >
            Passer
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}