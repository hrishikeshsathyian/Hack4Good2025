'use client';
import axiosInstance from "@/utils/axiosInstance";
import { createUserFirebaseBody } from "@/utils/interfaces";
import { useState } from "react";

const CreateUserForm = () => {
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
        alert("User created successfully!");
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
    <div className="min-h-screen flex items-center justify-center bg-white">
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
              name="display_name" // Match with the formData key
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
              name="email" // Match with the formData key
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
    </div>
  );
};

export default CreateUserForm;
