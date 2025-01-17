"use client";
import axiosInstance from "@/utils/axiosInstance";
import { AuctionItem } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

export default function ManageAuctions() {
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([]);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAuction, setNewAuction] = useState({ name: "", description: "" });
  const [toggle, setToggle] = useState(false);  

    // Fetch auction items from the API
    useEffect(() => {
      async function fetchAuctionItems() {
        try {
            const response = await axiosInstance.get("/auction_items");
            const data = await response.data;
          setAuctionItems(data);
        } catch (error) {
          console.error("Error fetching auction items:", error);
        }
      }
      fetchAuctionItems();
    }, [toggle]);
  const handleAddAuctionItem = async () => {
    const data = {
        name: newAuction.name,
        description: newAuction.description,
    }
    const response = await axiosInstance.post("/add_auction_item", data);
    console.log(response.data);
    setToggle(!toggle);
    setNewAuction({ name: "", description: "" });
    setIsModalOpen(false);
    
  };

  const handleEndAuction = async (current_highest_bidder_id: string, auction_id: string, auction_product_id: string) => {
    const data = {
        current_highest_bidder_id: current_highest_bidder_id ,
        auction_id: auction_id,
        auction_product_id: auction_product_id
    }
    console.log(data);
    const response = await axiosInstance.post("/end_auction", data);
    console.log(response.data);
    setToggle(!toggle);
  }

  return (
    <div className="bg-white text-black min-h-screen p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">Manage Auctions</h1>

      {/* Add Auction Item Button */}
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Auction Item
        </button>
      </div>

      {/* Auction Items Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="px-4 py-2 border-b">Item Name</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Highest Bid</th>
              <th className="px-4 py-2 border-b">Highest Bidder</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {auctionItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 text-center">
                <td className="px-4 py-2 border-b">{item.name}</td>
                <td className="px-4 py-2 border-b">{item.description}</td>
                <td className="px-4 py-2 border-b">${item.current_highest_bid}</td>
                <td className="px-4 py-2 border-b">{item.current_highest_bidder}</td>
                <td className="px-4 py-2 border-b">{item.status}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEndAuction(item.current_highest_bidder_id, item.id, item.auction_product_id)}
                    className={`px-3 py-1 rounded ${item.status === "SOLD" ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"}`}
                    disabled={item.status === "SOLD"}
                  >
                    End Auction
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 flex justify-center">
        
          <button
            onClick={() => router.push("/admin/landing-page")}
            className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back To Landing Page
          </button>
 
      </div>
      </div>

      {/* Modal for Adding Auction Item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Auction Item</h2>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Item Name</label>
              <input
                type="text"
                value={newAuction.name}
                onChange={(e) =>
                  setNewAuction((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                Description
              </label>
              <textarea
                value={newAuction.description}
                onChange={(e) =>
                  setNewAuction((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAuctionItem}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-center">
        
        <button
          onClick={() => router.push("/admin/landing-page")}
          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back To Landing Page
        </button>
      
    </div>
    </div>
  );
}
