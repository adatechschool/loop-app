import React from 'react';
import { Image } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface ImageCarouselProps {
  images: string[];
  title?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, title }) => {
  return (
    <Carousel
      swipeable={true}
      dynamicHeight={true}
      emulateTouch={true}
      infiniteLoop={true}
      showArrows={false}
      showThumbs={false}
    >
      {images.map((image, index) => (
        <div key={index}>
          <Image src={image} alt={title || `Image ${index + 1}`} objectFit="cover" />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
