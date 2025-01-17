"use client";

import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function Minimart() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const router = useRouter();
  const {user} = useAuth();
  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out of your account?");
    if (!confirmLogout) return;
    try {
      await signOut(auth);
      toast.success("Logged out successfully! See you again :)", {
        duration: 5000,
      });
      router.push("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  

  useEffect(() => {
    if (!user?.email) return; // Wait until the user is available

    const obtainTransactionHistory = async () => {
      try {
        const response = await axiosInstance.post(
          "/get_transaction_history",
          { email: user?.email }
        );
        setTransactionHistory(response.data.transaction_history);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        alert("An error occurred while fetching transaction history.");
      }
    };
  
    obtainTransactionHistory();
  }, [user?.email]);

  return (
    <>
      {/* Global Reset */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>

      <div className="flex min-h-screen">
        {/* Main Content Area */}
        <div
          className="flex flex-col flex-1 m-0 p-0"
          style={{ backgroundColor: "#EDEBE9" }}
        >
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
                ONLINE MINIMART
              </span>
            </div>
            <div className="flex items-center space-x-4">
    <span className="font-medium text-lg">0</span>
    <button
      onClick={handleLogout}
      style={{ backgroundColor: "red"}}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md font-medium focus:outline-none"
    >
      Logout
    </button>
  </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={`fixed top-[4.5rem] left-0 w-full bg-white z-10 shadow-lg transform transition-all duration-300 ${
              isMobileMenuOpen
                ? "max-h-screen opacity-100"
                : "max-h-0 opacity-0"
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

          {/* Transaction Table Section */}
          <div className="p-4 m-0 mt-0 bg-white">
            <h2 className="text-lg font-bold mb-4 mt-0 text-black text-center">
              Transaction History
            </h2>
            <div className="overflow-x-auto mx-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-white border-b-2">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left text-gray-700">Issuer</th>
                    <th className="px-4 py-2 text-left text-gray-700">Item</th>
                    <th className="px-4 py-2 text-left text-gray-700">Quantity</th>
                    <th className="px-4 py-2 text-left text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-gray-700">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map((txn, index) => (
                    <tr
                      key={txn.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      }`}
                    >
                      <td className="px-4 py-2 text-gray-800">{txn.amount}</td>
                      <td className="px-4 py-2 text-gray-800">
                        {txn.issuer_name || "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-800">
                        {txn.product_name || "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-800">
                        {txn.quantity || "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-800">
                        {new Date(txn.created_at).toLocaleString("en-SG", {
                          timeZone: "Asia/Singapore",
                        })}
                      </td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          txn.transaction_type === "inflow"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {txn.transaction_type.charAt(0).toUpperCase() +
                          txn.transaction_type.slice(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
