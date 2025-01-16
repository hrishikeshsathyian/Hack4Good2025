"use client";

import Image from "next/image";
import { useState } from "react";

export default function AuctionPage() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentBid, setCurrentBid] = useState(45.0); // Example current bid value
  const [inputValue, setInputValue] = useState(currentBid.toFixed(2));

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleFormClick = (event) => {
    event.stopPropagation();
  };

  const handleInputChange = (event) => {
    const value = event.target.value;

    // Validate the input to ensure it's a number with up to 2 decimal places
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setInputValue(value);
    }
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
              ONLINE AUCTION
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
              <a href="pending-items" className="hover:underline">
                Pending Items
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

        <div className="relative flex-1 overflow-y-scroll px-6 py-4 bg-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative">
            {/* Render Auction Product Boxes */}
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className={`relative ${
                  expandedCard === index ? "absolute left-0 right-0 mx-auto z-50" : ""
                } transform transition-transform duration-500 ease-out ${
                  expandedCard === index ? "scale-105 top-0" : "scale-100"
                } bg-white shadow-md cursor-pointer hover:scale-105`}
                style={
                  expandedCard === index
                    ? {
                        width: "90%",
                        maxWidth: "600px",
                      }
                    : {}
                }
                onClick={() => toggleCard(index)}
              >
                <div className="flex">
                  {/* Product Image */}
                  <div className="w-1/3">
                    <Image
                      src={`/path-to-product-image-${index + 1}.png`}
                      alt={`Product ${index + 1}`}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {/* Product Summary */}
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <h2 className="font-medium text-lg">Product {index + 1}</h2>
                    <p className="text-sm text-gray-500">
                      Auction ends in: 2h 30m
                    </p>
                    <p className="font-semibold text-blue-700 mt-2">
                      Current Bid: ${currentBid.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedCard === index && (
                  <div
                    className="p-4 border-t border-gray-300"
                    onClick={handleFormClick} // Prevent toggling the card when clicking inside the form
                  >
                    <p className="text-gray-600 mb-4">
                      Detailed description of Product {index + 1}. Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Proin
                      pharetra eros eget felis facilisis.
                    </p>
                    <form>
                      <label className="block text-gray-700 font-medium mb-2">
                        Place Your Bid:
                      </label>
                      <input
  type="number"
  value={inputValue}
  step="0.01" // Allow up to 2 decimal places
  min={currentBid} // Ensure the bid is greater than or equal to the current bid
  className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black placeholder:text-gray-500" // Dark text and better placeholder color
  placeholder="Enter your bid"
  onChange={handleInputChange}
/>

                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                      >
                        Submit Bid
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
