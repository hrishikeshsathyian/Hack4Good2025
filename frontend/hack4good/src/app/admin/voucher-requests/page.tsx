"use client";
import axiosInstance from "@/utils/axiosInstance";
import { Transaction } from "@/utils/interfaces";
import { useEffect, useState } from "react";


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Initial data
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get('/voucher_requests');
        const data = await response.data;
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } 
    }
    fetchUsers();
  }, []);
  // Filter transactions based on the search term
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id: string) => {
    // Simulate approval logic (replace with API call)
    // const updatedTransactions = transactions.map((transaction) => {
    const response = await axiosInstance.post('/voucher_requests/approve/' + id);
    console.log(response)
    alert(`Transaction ID ${id} approved!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-black">Pending Voucher Transactions</h1>
        
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-black"
          />
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-black">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-black">User Name</th>
                <th className="py-2 px-4 border-b text-black">Product Name</th>
                <th className="py-2 px-4 border-b text-black">Date Created</th>
                <th className="py-2 px-4 border-b text-black">Price</th>
                <th className="py-2 px-4 border-b text-black">Status</th>
                <th className="py-2 px-4 border-b text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-2 px-4 border-b text-black">{transaction.user_name}</td>
                  <td className="py-2 px-4 border-b text-black">{transaction.product_name}</td>
                  <td className="py-2 px-4 border-b text-black">{new Date(transaction.acquired_at).toISOString().split("T")[0]}</td>
                  <td className="py-2 px-4 border-b text-black">{transaction.price}</td>
                  <td className="py-2 px-4 border-b text-black">{transaction.status}</td>
                  <td className="py-2 px-4 border-b text-black">
                    {transaction.status === "READY" && (
                      <button
                        onClick={() => handleApprove(transaction.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
