import React, { useState, useEffect } from "react";

/**
 * Carousel — Simple auto-advancing image slideshow.
 * Bug fix: removed `currentIndex` from the useEffect dependency array;
 * it was causing the interval to reset on every slide change.
 */
const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [images.length]); // Only restart when the images array length changes

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Slide ${i + 1}`}
          className={`w-full object-cover transition-opacity duration-700 ${
            i === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
          style={{ height: "320px" }}
        />
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? "bg-white w-4" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
