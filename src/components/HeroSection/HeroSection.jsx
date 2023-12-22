import React from "react";
import Carousel from "./Carousel";

const HeroSection = () => {
  const images = [
    "https://res.cloudinary.com/satish07/image/upload/v1703268124/iczcf7vr2czz6lwha743.png",
    "https://res.cloudinary.com/satish07/image/upload/v1703271172/tajxlqslrdwprypoxabh.jpg",
    "https://res.cloudinary.com/satish07/image/upload/v1703270988/mr4pwsxbmo2smmrxqbkk.jpg",
    "https://res.cloudinary.com/satish07/image/upload/v1703271176/f12eyvlav190akxpzsvd.jpg"
  ];
  return (
    <section className="hero px-8 py-16">
      <div className="container mx-auto flex items-center justify-between">
        <div className="w-1/2">
          <h6 className="text-lg">
            <em>Are you hungry?</em>
          </h6>
          <h1 className="text-3xl md:text-6xl font-bold">Don't wait!</h1>
          <button
            data-tilt
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-6 mt-6 border-b-4 border-orange-700 hover:border-orange-500 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
          >
            Order Now
          </button>
        </div>
        <div className="w-1/2">
          <Carousel images={images} />
          {/* <img src="src\assets\hero-pizza.png" alt="" data-tilt /> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
