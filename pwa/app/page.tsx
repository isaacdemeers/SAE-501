'use client'
import { useEffect, useState } from 'react';

const ImageComponent = () => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Fetch the image URL from your Symfony API
    const fetchImageUrl = async () => {
      try {
        const response = await fetch(`/api/images/67197595006ff.png`);
        const data = await response.json();
        setImageUrl(data.url);
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };

    fetchImageUrl();
  }, []);

  if (!imageUrl) {
    return <p>Loading image...</p>;
  }

  return (
    <div>
      <img src={imageUrl} alt={`Image of 67197595006ff.png`} />
    </div>
  );
};

export default ImageComponent;