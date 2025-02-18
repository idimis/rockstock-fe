import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import heroImage from '@/public/goth.jpeg';

const textArray = [
  "Furnish Your Space with Attitude.",
  "Create a Home as Unique as Your Sound.",
  "Rock Your World with Custom Furniture.",
  "Transform Your Living Space Into a Masterpiece."
];

const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % textArray.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
                  <div className="relative flex items-center justify-between w-full overflow-hidden">
      <div className="flex items-center justify-between z-10 w-full px-16 py-8">
        <div className="flex flex-col items-start space-y-6 w-1/2">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentText}
              className="text-3xl md:text-4xl font-bold text-black"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              {textArray[currentText]}
            </motion.h1>
          </AnimatePresence>

          <p className="text-lg md:text-1xl text-black">
            The ultimate furniture collection for those who lived and breathed the music of the 90s-00s. Rock your home with style and nostalgia.
          </p>

          <div className="flex space-x-4">
            <a
              href="/shop"
              className="px-6 py-3 border border-black text-black font-semibold rounded-md hover:bg-black hover:text-white transition"
            >
              Shop Our Collection
            </a>
            <a
              href="/about"
              className="px-6 py-3 bg-transparent border border-black text-black font-semibold rounded-md hover:bg-black hover:text-white transition"
            >
              Learn More About Us
            </a>
          </div>
        </div>

        <div className="w-1/2 hidden md:block">
          <Image
            src={heroImage}
            alt="Hero Image"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
