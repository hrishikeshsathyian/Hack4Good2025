"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push("/admin/view-users")}
            className="flex items-center justify-center w-64 h-40 bg-grey text-black text-lg font-semibold rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            Manage Users
          </button>
          <button
            onClick={() => router.push("/admin/add-users")}
            className="flex items-center justify-center w-64 h-40 bg-grey text-black text-lg font-semibold rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            Onboard User
          </button>
          <button

            className="flex items-center justify-center w-64 h-40 bg-grey text-black text-lg font-semibold rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            Generate Report
          </button>
          <button
            
            className="flex items-center justify-center w-64 h-40 bg-grey text-black text-lg font-semibold rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            Weekly Summaries
          </button>
        </div>
      </div>
    </div>
  );
}
