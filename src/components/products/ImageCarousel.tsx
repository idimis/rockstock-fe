import { useState } from "react";

interface ImageCarouselProps {
  images: { productPictureUrl: string; position: number }[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentPosition, setCurrentPosition] = useState(1);

  const nextImage = () => {
    if (currentPosition < images.length) setCurrentPosition(currentPosition + 1);
  };

  const prevImage = () => {
    if (currentPosition > 1) setCurrentPosition(currentPosition - 1);
  };

  const currentImage = images.find((img) => img.position === currentPosition);

  return (
    <div className="relative w-64 h-64">
      <img src={currentImage?.productPictureUrl || "/placeholder.png"} alt="Product" className="w-full h-full object-cover rounded-md" />
      {currentPosition > 1 && (
        <button onClick={prevImage} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1">
          ◀
        </button>
      )}
      {currentPosition < images.length && (
        <button onClick={nextImage} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1">
          ▶
        </button>
      )}
    </div>
  );
};

export default ImageCarousel;