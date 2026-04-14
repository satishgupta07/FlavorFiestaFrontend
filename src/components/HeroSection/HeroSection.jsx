import React from "react";
import Carousel from "./Carousel";

const HERO_IMAGES = [
  "https://res.cloudinary.com/satish07/image/upload/v1703268124/iczcf7vr2czz6lwha743.png",
  "https://res.cloudinary.com/satish07/image/upload/v1703271172/tajxlqslrdwprypoxabh.jpg",
  "https://res.cloudinary.com/satish07/image/upload/v1703270988/mr4pwsxbmo2smmrxqbkk.jpg",
  "https://res.cloudinary.com/satish07/image/upload/v1703271176/f12eyvlav190akxpzsvd.jpg",
];

const HeroSection = () => {
  const scrollToMenu = () => {
    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Fresh &amp; Hot
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Craving <span className="text-orange-500">something</span> delicious?
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto md:mx-0">
            Order your favourite food and get it delivered hot and fresh to your doorstep.
          </p>
          <button
            onClick={scrollToMenu}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base px-7 py-3 rounded-full shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Order Now
          </button>
        </div>

        {/* Carousel */}
        <div className="flex-1 w-full max-w-md md:max-w-none">
          <Carousel images={HERO_IMAGES} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
