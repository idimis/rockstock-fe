"use client";

import React from 'react';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Navbar';
import Navbar from '@/components/common/Header';

import HeroSection from '@/components/homepage/HeroSection';
import ProductCategories from '@/components/homepage/ProductCategories';
import FeaturedProducts from '@/components/homepage/FeaturedProducts';
import NewestProducts from '@/components/homepage/NewestProducts';


// import Testimonials from '@/components/homepage/Testimonials';



const Page: React.FC = () => {
  return (
      <div>
        
        <Navbar />
        <Header />
        <HeroSection />
        <FeaturedProducts />
        <NewestProducts />
        <ProductCategories />
        {/* <Testimonials /> */}
        <Footer />
       
      </div>
  );
};

export default Page;
