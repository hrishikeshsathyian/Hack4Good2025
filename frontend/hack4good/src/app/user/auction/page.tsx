"use client";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AuctionPage() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [auctionItems, setAuctionItems] = useState([]);
  const [voucherPoints, setVoucherPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleFormClick = (event) => {
    event.stopPropagation();
  };

  // Fetch auction items
  const fetchAuctionItems = async () => {
    try {
      const response = await axiosInstance.get("/auction_items");
      setAuctionItems(response.data);
    } catch (error) {
      console.error("Error fetching auction items:", error);
      alert("Error fetching auction items");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's voucher points
  useEffect(() => {
    if (!user?.email) return;

    const fetchVoucherPoints = async () => {
      try {
        const response = await axiosInstance.get(`/get_user_voucher_points/${user.email}`);
        setVoucherPoints(response.data);
      } catch (error) {
        console.error("Error fetching voucher points:", error);
        setVoucherPoints(0);
      }
    };

    fetchVoucherPoints();
  }, [user?.email]);

  // Initial fetch of auction items
  useEffect(() => {
    fetchAuctionItems();
  }, []);

  // Handle bid submission
  const handleBidSubmit = async (event, item) => {
    event.preventDefault();
    const bidAmount = parseInt(event.target.bid.value);

    console.log("Sending auction_id:", item.id);

    // Validate bid amount
    if (bidAmount <= item.current_highest_bid) {
      alert(`Bid must be higher than current bid of $${item.current_highest_bid}`);
      return;
    }

    // Check if user has enough points
    if (bidAmount > voucherPoints) {
      alert("Insufficient voucher points");
      return;
    }

    try {
      await axiosInstance.post("/place_bid", {
        auction_id: item.auction_product_id,
        user_email: user.email,
        bid_amount: bidAmount
      });

      alert("Bid placed successfully!");
      setExpandedCard(null);
      
      // Refresh data
      await Promise.all([
        fetchAuctionItems(),
        // Refetch voucher points since they've changed
        axiosInstance.get(`/get_user_voucher_points/${user.email}`).then(res => setVoucherPoints(res.data))
      ]);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.detail || "Error placing bid");
      } else {
        alert("Error placing bid");
      }
    }
  };

  // Format time remaining in auction
  const formatTimeLeft = (endTime) => {
    if (!endTime) return "No end time set";
    
    const end = new Date(endTime);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return "Auction ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-1" style={{ backgroundColor: "#EDEBE9" }}>
        {/* Header Section */}
        <div className="w-full text-white flex justify-between items-center px-6 py-4 bg-blue-900">
          <div className="flex items-center space-x-2">
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
          <span className="font-medium text-lg">{voucherPoints}</span>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`fixed top-[4.5rem] left-0 w-full bg-white z-10 shadow-lg transform transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
          style={{ color: "#424242" }}
        >
          <ul className="space-y-2 p-4">
            <li><a href="pending-items" className="hover:underline">Pending Items</a></li>
            <li><a href="minimart" className="hover:underline">Minimart</a></li>
            <li><a href="auction" className="hover:underline">Auction</a></li>
            <li><a href="transaction_history" className="hover:underline">Transaction History</a></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="relative flex-1 overflow-y-scroll px-6 py-4 bg-gray-200">
          {isLoading ? (
            <div className="text-center py-10">Loading auction items...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative">
              {auctionItems.map((item, index) => (
                
                <div
                  key={item.id}
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
                        src={item.image_url ?? "/no_image.png"}
                        alt={item.name}
                        width={150}
                        height={150}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Product Summary */}
                    <div className="w-2/3 p-4 flex flex-col justify-between">
                      <h2 className="font-medium text-lg">{item.name}</h2>
                      <p className="text-sm text-gray-500">
                        {formatTimeLeft(item.end_time)}
                      </p>
                      <p className="font-semibold text-blue-700 mt-2">
                        Current Bid: ${item.current_highest_bid}
                      </p>
                      {item.current_highest_bidder && (
                        <p className="text-sm text-gray-600">
                          Highest Bidder: {item.current_highest_bidder}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedCard === index && (
                    <div
                      className="p-4 border-t border-gray-300"
                      onClick={handleFormClick}
                    >
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      {item.status !== "SOLD" ? (
                        <form onSubmit={(e) => handleBidSubmit(e, item)}>
                          <label className="block text-gray-700 font-medium mb-2">
                            Place Your Bid:
                          </label>
                          <input
                            name="bid"
                            type="number"
                            step="1"
                            min={item.current_highest_bid + 1}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
                            placeholder={`Min bid: $${item.current_highest_bid + 1}`}
                            required
                          />
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
                          >
                            Place Bid
                          </button>
                        </form>
                      ) : (
                        <div className="text-red-600 font-bold text-center">
                          Auction Ended
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}