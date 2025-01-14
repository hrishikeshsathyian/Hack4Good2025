"use client";

import Image from "next/image";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../../lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        GoogleAuthProvider.credentialFromResult(result);
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
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
        className="w-[240px] bg-white text-blue-600 font-semibold text-lg py-3 px-6 rounded-full shadow-md hover:bg-gray-200 transition duration-200"
        style={{ color: "#1f3d77" }}
        onClick={handleSignIn}
      >
        Login
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
