"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase";
import toast from "react-hot-toast";
import { FaArrowRight, FaUser, FaUsersGear, FaBook, FaCalendarDays } from "react-icons/fa6";

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
      <header className="w-full flex justify-between items-center px-8 py-4" style={{ backgroundColor: "#1F3D77" }}>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push("/admin/view-users")}
            className="flex items-center justify-between w-80 h-20 px-6 py-4 bg-gray-200 text-black text-lg font-semibold rounded-lg shadow-md hover:bg-[#1F3D77] hover:text-white transition group"
          >
            <FaUsersGear className="mr-auto"/>
            <span>Manage Users</span>
            <FaArrowRight className="ml-auto transform transition-transform duration-300 group-hover:translate-x-2" />
          </button>
          <button
            onClick={() => router.push("/admin/add-users")}
            className="group flex items-center justify-between w-80 h-20 px-6 py-4 bg-gray-100 text-black text-lg font-semibold rounded-lg shadow-md hover:bg-[#1F3D77] hover:text-white transition"
          >
            <FaUser className="mr-auto"/>
            <span>Onboard User</span>
            <FaArrowRight className="ml-auto transform transition-transform duration-300 group-hover:translate-x-2" />
          </button>
          <button
            className="group flex items-center justify-between w-80 h-20 px-6 py-4 bg-gray-200 text-black text-lg font-semibold rounded-lg shadow-md hover:bg-[#1F3D77] hover:text-white transition"
          >
            <FaBook className="mr-auto" />
            <span>Generate Report</span>
            <FaArrowRight className="ml-auto transform transition-transform duration-300 group-hover:translate-x-2" />
          </button>
          <button
            className="group flex items-center justify-between w-80 h-20 px-6 py-4 bg-gray-100 text-black text-lg font-semibold rounded-lg shadow-md hover:bg-[#1F3D77] hover:text-white transition"
          >
            <FaCalendarDays className="mr-auto"/>
            <span>Weekly Summaries</span>
            <FaArrowRight className="ml-auto transform transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
