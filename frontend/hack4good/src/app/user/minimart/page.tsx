"use client";

import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Minimart() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Store selected product details
  const [productList, setProductList] = useState<any[]>([]); // Store product list

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const getAllProducts = async () => {
    try {
      const response = await axiosInstance.get("/get_all_products");
      setProductList(response.data); // Update state
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("An error occurred while fetching products.");
    }
  };

  const getFilteredProducts = async (filter: string) => {
    try {
      const response = await axiosInstance.get(
        `/get_filtered_products/${filter}`
      );
      setProductList(response.data); // Update state
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("An error occurred while fetching products.");
    }
  };

  const filterProducts = (category: string) => () => {
    getFilteredProducts(category);
    setIsCategoriesOpen(false);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

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
            {["Electronics", "Food", "Clothings"].map((category, index) => (
              <li
                key={index}
                className="py-2 border-b border-gray-300 text-gray-700 hover:text-blue-600 cursor-pointer transition-all duration-300 ease-in-out"
                onClick={filterProducts(category)}
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
          className={`absolute top-[4.5rem] left-200 w-full bg-white z-50 shadow-lg transform transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <ul className="space-y-2 p-4 text-gray-700">
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
            {productList.map((product) => (
              <div
                key={product.id}
                className="bg-gray-300 h-40 shadow-md flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={() => openModal(product)}
              >
                <div className="flex justify-center w-100 h-100">
                  <Image
                    src={product.image_url ?? "/no_image.png"}
                    alt={product.name}
                    width={100}
                    height={100}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                    }}
                  />
                </div>
                <div className="bg-white w-full h-10 border-t-2 flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-700 font-medium">
                    {product.name}
                  </span>
                  <span className="text-sm text-blue-700 font-medium">
                    {product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Product Details */}
            <h2 className="text-2xl font-bold mb-4 text-black">
              {selectedProduct.name}
            </h2>
            <Image
              src={selectedProduct.image_url ?? "/no_image.png"}
              alt={selectedProduct.name}
              width={300}
              height={300}
              className="mx-auto mb-4"
            />
            <p className="text-gray-700">{selectedProduct.description}</p>
            <p className="text-lg text-blue-600 font-bold mb-4">
              ${selectedProduct.price.toFixed(2)}
            </p>
            {selectedProduct.qty > 0 ? (
              <div className="text-green-600 font-bold">
                In Stock: {selectedProduct.qty}
                <button
                  className="ml-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800"
                  onClick={() =>
                    alert(`Purchasing item: ${selectedProduct.name}`)
                  }
                >
                  Purchase Item
                </button>
              </div>
            ) : (
              <div className="text-red-600 font-bold justify-between bg-black">
                Out of Stock
                <button
                  className="ml-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800"
                  onClick={() =>
                    alert(`Requesting item: ${selectedProduct.name}`)
                  }
                >
                  Request Item
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
