"use client";
import axiosInstance from '@/utils/axiosInstance';
import { firebaseUser } from '@/utils/interfaces';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState<firebaseUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from the API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get('/get/users');
        const data = await response.data;
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Delete user by email
  async function handleDelete(uid:string) {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      const response = await axiosInstance.delete(`/delete/user/${uid}`);

      if (response.status === 200) {
        setUsers(users.filter(user => user.uid !== uid));
        toast.success('User deleted successfully', {
            duration: 5000, 
          });
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">User Management</h1>

      <div className="bg-white rounded shadow-md p-4">
        {loading ? (
          <p className='text-blue-500'>Loading users...</p>
        ) : users.length === 0 ? (
          <p className='text-red-500'>No users found.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <ul>
              {users.map(user => (
                <li
                  key={user.email}
                  className="flex justify-between items-center border-b border-gray-200 py-2 px-4"
                >
                  <div>
                    <p className="text-sm font-medium text-black">{user.display_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(user.uid)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}