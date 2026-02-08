import React, { useState, useEffect } from "react";
import AddProductForm from "../components/AddProductForm";
import API from "../api";
import { FiChevronLeft, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function AddProductPage({ onProductAdded }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    API.get("/users/profile/")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!user || user.role !== "ARTISAN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-4xl mb-6">
          <FiShoppingBag />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
        <p className="text-gray-600 max-w-md mb-8">
          Only verified artisans can list products on the marketplace. Please upgrade your account or contact support.
        </p>
        <Link to="/marketplace" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
          <FiChevronLeft /> Back to Marketplace
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-900 p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-display font-bold mb-2">List New Product</h1>
              <p className="text-indigo-200">Share your craftsmanship with the world.</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-50 -mr-20 -mt-20" />
          </div>

          <div className="p-8 md:p-10">
            <AddProductForm authToken={localStorage.getItem("authToken")} onProductAdded={onProductAdded} />
          </div>
        </div>
      </div>
    </div>
  );
}
