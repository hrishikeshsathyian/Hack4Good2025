"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase";
import toast from "react-hot-toast";
import { FaBook, FaCalendarDays, FaUser, FaGavel } from "react-icons/fa6";

export default function AdminDashboard() {
  const router = useRouter();

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
        <div className="grid grid-cols-3 gap-6">
          {/* Row 1 */}
          <button
            onClick={() => router.push("/admin/view-users")}
            className="flex items-center justify-center w-64 h-40 bg-gray-200 text-black text-lg font-semibold rounded-lg shadow-md transition hover:bg-blue-500 hover:text-white"
          >
            <FaUser className="mr-2" />
            Manage Users
          </button>
          <button
            onClick={() => router.push("/admin/voucher-requests")}
            className="flex items-center justify-center w-64 h-40 bg-gray-200 text-black text-lg font-semibold rounded-lg shadow-md transition hover:bg-blue-500 hover:text-white"
          >
            <FaBook className="mr-2" />
            Voucher Requests
          </button>
          <button
            onClick={() => router.push("/admin/manage-inventory")}
            className="flex items-center justify-center w-64 h-40 bg-gray-200 text-black text-lg font-semibold rounded-lg shadow-md transition hover:bg-blue-500 hover:text-white"
          >
            <FaBook className="mr-2" />
            Manage Inventory
          </button>

          {/* Row 2 */}
          <div className="col-span-3 flex justify-center gap-6">
            <button
              onClick={() => router.push("/admin/generate-summary")}
              className="flex items-center justify-center w-64 h-40 bg-gray-200 text-black text-lg font-semibold rounded-lg shadow-md transition hover:bg-blue-500 hover:text-white"
            >
              <FaCalendarDays className="mr-2" />
              Generate Summaries
            </button>
            <button
              onClick={() => router.push("/admin/manage-auction")}
              className="flex items-center justify-center w-64 h-40 bg-gray-200 text-black text-lg font-semibold rounded-lg shadow-md transition hover:bg-blue-500 hover:text-white"
            >
              <FaGavel className="mr-2" />
              Manage Auction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}