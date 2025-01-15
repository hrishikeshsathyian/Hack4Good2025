"use client";

import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Minimart() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const obtainTransactionHistory = async () => {
    try {
      const response = await axiosInstance.post(
        "/get_transaction_history",
        { uuid: "199df3ea-8bb4-43be-bf23-d5677582bfee" } // Pass the recipient_id as a JSON object
      );
      setTransactionHistory(response.data.transaction_history); // Update state
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      alert("An error occurred while fetching transaction history.");
    }
  };

  // Fetch transaction history on page load
  useEffect(() => {
    obtainTransactionHistory();
  }, []);

  // Fake transaction data (replace this with Supabase data later)
  // Note that the transaction date data is in UTC format
  const fakeTransactions = [
    {
      id: "1",
      amount: 50,
      issuer: "Admin",
      item: null,
      quantity: 1,
      date_of_transaction: "2025-01-01T10:00:00Z",
      transaction_type: "inflow",
    },
    {
      id: "2",
      amount: -20,
      issuer: null,
      item: "Product XYZ",
      quantity: 2,
      date_of_transaction: "2025-01-03T15:30:00Z",
      transaction_type: "outflow",
    },
    {
      id: "3",
      amount: 100,
      issuer: "Admin",
      item: null,
      quantity: null,
      date_of_transaction: "2025-01-05T12:00:00Z",
      transaction_type: "inflow",
    },
  ];

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
              isMobileMenuOpen
                ? "max-h-screen opacity-100"
                : "max-h-0 opacity-0"
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

          {/* Transaction Table Section */}
          <div className="p-4 m-0 mt-0">
            <h2 className="text-lg font-bold mb-4 mt-0 text-black text-center">
              Transaction History
            </h2>
            <div className="overflow-x-auto mx-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="px-4 py-2 text-left"
                      style={{ color: "#424242" }}
                    >
                      Amount
                    </th>
                    <th
                      className="px-4 py-2 text-left"
                      style={{ color: "#424242" }}
                    >
                      Issuer
                    </th>
                    <th
                      className="px-4 py-2 text-left"
                      style={{ color: "#424242" }}
                    >
                      Item
                    </th>
                    <th
                      className="px-4 py-2 text-left"
                      style={{ color: "#424242" }}
                    >
                      Quantity
                    </th>
                    <th
                      className="px-4 py-2 text-left"
                      style={{ color: "#424242" }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="shadow">
                  {transactionHistory.map((txn) => (
                    <tr
                      key={txn.id}
                      className={`${
                        txn.transaction_type === "inflow"
                          ? "bg-emerald-100"
                          : "bg-rose-100"
                      }`}
                    >
                      {/* Amount */}
                      <td className="px-4 py-2" style={{ color: "#424242" }}>
                        {txn.amount}
                      </td>
                      {/* Issuer */}
                      <td className="px-4 py-2" style={{ color: "#424242" }}>
                        {txn.issuer_name || "-"}
                      </td>
                      {/* Item */}
                      <td className="px-4 py-2" style={{ color: "#424242" }}>
                        {txn.product_name}
                      </td>
                      {/* Quantity */}
                      <td className="px-4 py-2" style={{ color: "#424242" }}>
                        {txn.quantity || "-"}
                      </td>
                      {/* Date */}
                      <td className="px-4 py-2" style={{ color: "#424242" }}>
                        {new Date(txn.created_at).toLocaleString("en-SG", {
                          timeZone: "Asia/Singapore",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-gray-500 text-center">
                Replace `fakeTransactions` with data fetched from Supabase!
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
