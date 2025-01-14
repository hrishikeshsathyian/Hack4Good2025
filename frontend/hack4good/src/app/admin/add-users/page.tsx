'use client';
import axiosInstance from "@/utils/axiosInstance";
import { createUserFirebaseBody } from "@/utils/interfaces";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const CreateUserForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<createUserFirebaseBody>({
    display_name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Sending data:", formData);

      const response = await axiosInstance.post("/create/user", formData);

      if (response.status === 200) {
        toast.success("User created successfully", {
          duration: 5000,
        });
        setFormData({
          display_name: "",
          email: "",
        });
      } else {
        alert("Failed to create user. Please try again.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-black">Add Resident To System</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black sm:text-sm"
              required
            />
          </div>

          <button
            disabled={!formData.display_name || !formData.email}
            type="submit"
            className={`w-full py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !formData.display_name || !formData.email
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
            }`}
          >
            Create User
          </button>
        </form>
      </div>
      <br />

      {/* Button for Managing Users */}
      <div className="mt-6"> {/* Added margin-top here */}
        <button
          onClick={() => router.push("/admin/view-users")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          Go To Manage Users
        </button>
      </div>
    </div>
  );
};

export default CreateUserForm;
