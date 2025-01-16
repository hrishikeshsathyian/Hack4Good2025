"use client";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import { PendingItem } from "@/utils/interfaces";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



const PendingItems = () => {
  const [filter, setFilter] = useState("ALL");
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([])
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) return;
    const email = user.email;
        async function fetchInventory() {
        try {
            const response = await axiosInstance.get('/get_pending_items/' + email);
            const data = await response.data;
            if (Array.isArray(data)) {
            setPendingItems(data);
            } else {
            console.error('Invalid inventory data format:', data);
            setPendingItems([]);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setPendingItems([]);
        } 
        }
        fetchInventory();
      }, [user]);
    if (!user) return null;
  const filteredItems   =
    filter === "ALL"
      ? pendingItems
      : pendingItems.filter((item) => item.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Pending Items</h1>
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${
            filter === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded ${
            filter === "READY" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setFilter("READY")}
        >
          Ready
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded ${
            filter === "REDEEMED" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setFilter("REDEEMED")}
        >
          Redeemed
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "WAITING FOR RESTOCK" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setFilter("WAITING FOR RESTOCK")}
        >
          Waiting for Restock
        </button>
      </div>
      <div className="bg-white rounded shadow p-4">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="w-1/4 border-b py-2 px-4 text-left text-black">Name</th>
              <th className="w-1/4 border-b py-2 px-4 text-left text-black">Price</th>
              <th className="w-1/4 border-b py-2 px-4 text-left text-black">Date Purchased</th>
              <th className="w-1/4 border-b py-2 px-4 text-left text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="border-b py-2 px-4 text-black">{item.name}</td>
                  <td className="border-b py-2 px-4 text-black">${item.price.toFixed(2)}</td>
                  <td className="border-b py-2 px-4 text-black">{new Date(item.date_purchased).toISOString().split("T")[0]}</td>
                  <td
                    className={`border-b py-2 px-4 font-bold ${
                      item.status === "READY"
                        ? "text-green-500"
                        : item.status === "REDEEMED"
                        ? "text-gray-500"
                        : "text-red-500"
                    }`}
                  >
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
};

export default PendingItems;
