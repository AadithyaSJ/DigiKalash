import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function ProductsOverview() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await API.get('/marketplace/products/');
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = sort
    ? [...filtered].sort((a, b) =>
        a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
      )
    : filtered;

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 text-xl">
        Loading products...
      </div>
    );

  return (
    <div className="max-w-8xl mx-auto px-6 lg:px-8 py-16 bg-gradient-to-tr from-purple-50 via-pink-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-14 gap-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600">
          Heritage Products
        </h1>
        <Link to="/add-product" className="inline-block">
          <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-3 rounded-full shadow-md transition-shadow hover:shadow-lg">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-6 mb-12 max-w-4xl mx-auto">
        <input
          type="search"
          className="flex-grow rounded-full border-2 border-purple-300 p-4 text-lg shadow-md focus:border-pink-500 focus:ring-4 focus:ring-pink-200 focus:outline-none transition"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
          spellCheck="false"
          autoComplete="off"
        />
        <select
          className="w-48 rounded-full border-2 border-purple-300 p-4 text-lg shadow-md focus:border-pink-500 focus:ring-4 focus:ring-pink-200 focus:outline-none transition"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort products"
        >
          <option value="">Sort By</option>
          <option value="price">Price (Low to High)</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {/* Products Grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {sorted.length === 0 && (
          <li className="col-span-full text-center text-lg font-semibold text-indigo-600">
            No products found.
          </li>
        )}
        {sorted.map((product) => (
          <li
            key={product.id}
            className="group cursor-pointer relative rounded-3xl overflow-hidden shadow-xl shadow-purple-400/20 bg-white hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Image */}
            <Link to={`/marketplace/details/${product.id}`}>
              <img
                src={product.main_image || '/placeholder.png'}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover rounded-3xl transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </Link>
            {/* Product Info */}
            <div className="p-6 space-y-3">
              <Link to={`/marketplace/details/${product.id}`}>
                <h3 className="text-2xl font-semibold text-purple-900 group-hover:text-pink-600 transition-colors duration-300">
                  {product.name}
                </h3>
              </Link>
              <p className="text-indigo-700 font-extrabold text-xl">₹{product.price}</p>
              <p className="text-gray-500 truncate">{product.short_description || product.description}</p>
              <div className="mt-3 flex items-center space-x-4 text-sm text-gray-400">
                <span>Stock: {product.inventory}</span>
                <span>|</span>
                <span>
                  Type:{" "}
                  <span className="capitalize">{product.product_type}</span>
                </span>
              </div>
            </div>
            {/* Badge */}
            {product.featured && (
              <span className="absolute top-4 left-4 bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md select-none">
                Featured
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsOverview;
