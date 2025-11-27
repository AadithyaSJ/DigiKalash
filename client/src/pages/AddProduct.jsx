import React, { useState, useEffect } from "react";
import AddProductForm from "../components/AddProductForm";
import API from "../api";

export default function AddProductPage({ onProductAdded }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // This assumes you have a /users/me/ endpoint that returns the current user's info
    API.get("/users/profile/")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <div>Loading...</div>;

  if (!user || user.role !== "ARTISAN") {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-red-100 rounded shadow text-red-700 font-semibold text-lg text-center">
        Only verified Artisans can add marketplace products.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Add New Product</h1>
      <AddProductForm authToken={localStorage.getItem("authToken")} onProductAdded={onProductAdded} />
    </div>
  );
}
