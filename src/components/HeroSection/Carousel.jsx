import React, { useState, useEffect } from "react";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [currentIndex, images.length]);

  return (
    <div className="flex justify-end">
      <img
        src={images[currentIndex]}
        alt={`carousel-${currentIndex}`}
        className="max-w-full max-h-48 lg:max-h-64 xl:max-h-96"
      />
    </div>
  );
};

export default Carousel;
