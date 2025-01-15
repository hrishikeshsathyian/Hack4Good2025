"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Minimart() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content Area */}
      <div
        className="flex flex-col flex-1"
        style={{ backgroundColor: "#EDEBE9" }}
      >
        {/* Header Section */}
        <div className="w-full text-white flex justify-between items-center px-6 py-4 bg-blue-900">
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
          </div>
          {/* Voucher Balance */}
          <span className="font-medium text-lg">0.00</span>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`fixed top-[4.5rem] left-0 w-full bg-white z-10 shadow-lg transform transition-all duration-300 ${
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
      </div>
    </div>
  );
}
