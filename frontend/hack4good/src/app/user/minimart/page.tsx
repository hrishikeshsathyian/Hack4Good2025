"use client";

import Image from "next/image";
import { useState } from "react";

export default function Minimart() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Categories Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white transform transition-transform duration-300 ease-in-out ${
          isCategoriesOpen ? "translate-x-0" : "-translate-x-full"
        } sm:relative sm:translate-x-0 sm:w-1/4`}
      >
        <div className="p-4">
          <h2
            className="font-semibold text-xl mb-4"
            style={{ color: "#1f3d77" }}
          >
            Categories
          </h2>
          <ul className="space-y-2">
            {["Bags", "Watches", "Games"].map((category, index) => (
              <li
                key={index}
                className="py-2 border-b border-gray-300 text-gray-700 hover:text-blue-600 cursor-pointer transition-all duration-300 ease-in-out"
                onClick={() => alert(`You clicked on ${category}`)}
              >
                {category}
              </li>
            ))}
          </ul>
          {/* Close Button for Mobile */}
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md sm:hidden"
            onClick={() => setIsCategoriesOpen(false)}
          >
            Close Categories
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header Section */}
        <div className="w-full text-white flex justify-between items-center px-6 py-4 bg-blue-900 relative z-50">
          <div className="flex items-center space-x-2">
            {/* Hamburger Menu Icon */}
            <button
              onClick={handleMenuToggle}
              className="p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {/* Shopping Cart Icon and Title */}
            <Image
              src="/shopping_cart_icon.png"
              alt="Shopping Cart Icon"
              width={20}
              height={20}
            />
            <span
              className="font-medium text-lg tracking-wide"
              style={{ letterSpacing: "0.2em" }}
            >
              ONLINE MINIMART
            </span>
            {/* Toggle Categories Button (Small Screens Only) */}
            <button
              className="ml-4 bg-white text-blue-600 px-3 py-2 rounded-md font-arimo sm:hidden"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              Categories
            </button>
          </div>
          {/* Voucher Balance */}
          <span className="font-medium text-lg">0.00</span>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`absolute top-[4.5rem] left-100 w-full bg-white z-50 shadow-lg transform transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
          style={{ color: "#424242" }}
        >
          <ul className="space-y-2 p-4">
            <li>
              <a href="home" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="minimart" className="hover:underline">
                Minimart
              </a>
            </li>
            <li>
              <a href="auction" className="hover:underline">
                Auction
              </a>
            </li>
            <li>
              <a href="transaction_history" className="hover:underline">
                Transaction History
              </a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-scroll px-6 py-4 bg-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Render Product Boxes */}
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 h-40 shadow-md flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
              >
                <div className="p-2">
                  <Image
                    src="/path-to-product-image.png"
                    alt={`Product ${index + 1}`}
                    width={100}
                    height={100}
                  />
                </div>
                <div className="bg-white w-full h-10 border-t-2 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    Product {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
