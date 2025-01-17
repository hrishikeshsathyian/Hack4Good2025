"use client";
import axiosInstance from "@/utils/axiosInstance";
import { firebaseUser } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";


export default function UsersPage() {
  const [users, setUsers] = useState<firebaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<firebaseUser | null>(null); // User being edited
  const [voucherPoints, setVoucherPoints] = useState(0); // Track voucher points during edit
  const router = useRouter();

  // Fetch users from the API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get("/get/users");
        const data = await response.data;
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Delete user by email
  async function handleDelete(email: string) {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      const response = await axiosInstance.delete(`/delete/user/${email}`);
      if (response.status === 200) {
        setUsers(users.filter((user) => user.email !== email));
        toast.success("User deleted successfully", { duration: 5000 });
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  // Handle opening the edit modal
  function handleEdit(user: firebaseUser) {
    setEditUser(user);
    setVoucherPoints(user.voucher_points || 0);
  }
  interface UpdateUserBody {
    uid: string
    supabase_id: string
    display_name: string
    email: string
    voucher_points: number
  }
  // Handle saving the edited user
  async function saveEdit() {
    if (!editUser) return;

    try {
      const updateUserBody : UpdateUserBody = {
        uid: editUser.uid,
        display_name: editUser.display_name,
        supabase_id: editUser.supabase_uid.toString(),
        email : editUser.email,
        voucher_points: voucherPoints,
      }
      const response = await axiosInstance.post("/update_user", updateUserBody);
      if (response.status === 200) {
        setEditUser(null);
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Top Bar with Back and Add User Buttons */}
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => router.push("/admin/add-users")}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Add User
        </button>
      </div>

      {/* Page Heading */}
      <div className="flex justify-center items-center pt-30">
        <h1 className="text-2xl font-bold mb-4 text-black">User Management</h1>
      </div>

      {/* User List */}
      <div className="bg-white rounded shadow-md p-4">
        {loading ? (
          <p className="text-blue-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-red-500">No users found.</p>
        ) : (
          <div className="max-h-100 overflow-y-auto">
            <ul>
              {users.map((user) => (
                <li
                  key={user.email} 
                  className="flex justify-between items-center border-b border-gray-200 py-2 px-4"
                >
                  <div>
                    <p className="text-sm font-medium text-black">{user.display_name}</p>
                    <p className="text-sm text-black">{user.email}</p>
                    <p className="text-sm text-black">
                      Voucher Points: {user.voucher_points || 0}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.email)}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Back to Landing Page Button */}
      <div className="mt-6 flex justify-center">
        {!loading && (
          <button
            onClick={() => router.push("/admin/landing-page")}
            className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back To Landing Page
          </button>
        )}
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-black">Edit User</h2>
            <label className="block mb-2 text-sm font-medium text-black">Display Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full p-2 mb-4 text-black"
              value={editUser.display_name}
              onChange={(e) =>
                setEditUser({ ...editUser, display_name: e.target.value })
              }
            />
            <label className="block mb-2 text-sm font-medium text-black">Email</label>
            <input
              type="email"
              className="border border-gray-300 rounded w-full p-2 mb-4 text-black"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
            <label className="block mb-2 text-sm font-medium text-black">Voucher Points</label>
            <input
              type="number"
              className="border border-gray-300 rounded w-full p-2 mb-4 text-black"
              value={voucherPoints}
              onChange={(e) => setVoucherPoints(Number(e.target.value))}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditUser(null)}
                className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
