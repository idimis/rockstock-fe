"use client";

import React from 'react';
// import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Carousel from '@/components/Carousel';
import MoreEvents from '@/components/MoreEvents';
import PopupReview from '@/components/PopupReview';



const Page: React.FC = () => {
  return (
      <div>
        {/* <Header /> */}
        <Carousel />
        <PopupReview />
        <MoreEvents />
        <Footer />
      </div>
  );
};

export default Page;
