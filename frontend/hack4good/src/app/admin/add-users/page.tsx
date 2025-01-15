'use client';
import axiosInstance from "@/utils/axiosInstance";
import { createUserBody } from "@/utils/interfaces";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import toast from "react-hot-toast";

const CreateUserForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<createUserBody>({
    display_name: "",
    email: "",
    phone_number: "",
    age: 0,
    voucher_points: 50,
    date_of_birth: new Date(),
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
      console.log("Form data:", formData);
      formData.voucher_points = Number(formData.voucher_points);
      formData.age = Number(formData.age);
      const response = await axiosInstance.post("/create/user", formData);
      if (response.status === 200) {
        toast.success("User created successfully", {
          duration: 5000,
        });
        setFormData({
          display_name: "",
          email: "",
          phone_number: "",
          age: 0,
          voucher_points: 50,
          date_of_birth: new Date(),
        });
      } else {
        alert("Failed to create user. Please try again.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const isSubmitDisabled = !formData.display_name || !formData.email || !formData.phone_number || !formData.age;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-black">Add Resident To System</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
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

          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
            </div>

            <div className="mb-4">
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
              Date Of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={new Date(formData.date_of_birth).toISOString().split('T')[0]}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              required
            />
            </div>

          <div className="mb-4">
            <label htmlFor="voucher_points" className="block text-sm font-medium text-gray-700">
              Voucher Points
            </label>
            <input
              type="number"
              id="voucher_points"
              name="voucher_points"
              value={formData.voucher_points}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>

          <button
            disabled={isSubmitDisabled}
            type="submit"
            className={`w-full py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSubmitDisabled
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
            }`}
          >
            Create User
          </button>
        </form>
      </div>
      <div className="mt-6">
        <button
          onClick={() => router.push("/admin/landing-page")}
          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back To Landing Page
        </button>
      </div>
    </div>
  );
};

export default CreateUserForm;
