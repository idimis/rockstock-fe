"use client";

import { useState } from "react";
import CategoryTable from "@/components/category/CategoryTable";
import Sidebar from "@/components/common/AdminSidebar";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const AdminCategory = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />
      
      {/* Navbar */}
      <Navbar />
      
      <div className="flex flex-grow text-black">
        {/* Sidebar */}
        <Sidebar />
        
        <main className="flex-grow p-6 shadow-md">       
          {/* CategoryTable instead of product table */}
          <CategoryTable />
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminCategory;
