"use client";

import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";

export default function Home() {
  const router = useRouter();
  const { loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        try {
          const user = result.user;
          const email = user.email;
          const response = await axiosInstance.get("/get_user_role/" + email);
          console.log("Role is: ", response.data);
 
  
          toast.success(`Sign-in successful. Role: ${response.data}`, {
            duration: 5000,
          });
  
          // Navigate based on role or general admin page
          if (response.data === "admin") {
            router.push("/admin/landing-page");
          } else {
            router.push("/user/minimart");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          toast.error("Failed to determine user role. Please try again.", {
            duration: 5000,
          });
        }
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
        toast.error("Oops! Sign-in failed :( Please try again.", {
          duration: 5000,
        });
        setError(error.message);
      });
  };
  
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: "#edebe9" }}
    >
      {/* Logo Section */}
      <div>
        <Image
          src="/mwh_logo_custom.png" // Update the path as per your file structure
          alt="Muhammadiyah Welfare Home Logo"
          width={300}
          height={300}
        />
      </div>

      {/* Online Minimart Section */}
      <div
        className="w-full text-white text-center py-4 mb-8 flex items-center justify-center space-x-2 font-arimo"
        style={{ letterSpacing: "0.2em", backgroundColor: "#1f3d77" }}
      >
        <Image
          src="/shopping_cart_icon.png" // Update the path as per your file structure
          alt="Shopping Cart Logo"
          width={20}
          height={20}
        />
        <p className="text-lg" style={{ fontSize: "20px" }}>
          ONLINE MINIMART
        </p>
      </div>

      {/* Login Button */}
      <button
        className="w-[240px] bg-white font-semibold text-lg py-3 px-6 rounded-full shadow-md hover:bg-gray-200 transition duration-200"
        style={{ color: "#1f3d77" }}
        onClick={handleSignIn}
      >
        {loading ? "Loading..." : "Login with Google"}
      </button>

      {/* Footer Section */}
      <div className="absolute bottom-4 text-center text-sm text-gray-500">
        <p>
          Trouble logging in?{" "}
          <a href="#" className="text-blue-600 underline">
            Contact an administrator
          </a>
        </p>
      </div>
      {error && (
        <p className="text-red-500">
          Oops, turns out you are not registered with us: {error}
        </p>
      )}
    </div>
  );
}
