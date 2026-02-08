import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { FiSearch, FiFilter, FiShoppingCart, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function ProductsOverview() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = sort
    ? [...filtered].sort((a, b) =>
      a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
    )
    : filtered;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Artisan Marketplace
            </h1>
            <p className="text-gray-600 max-w-2xl text-lg">
              Support local artisans and bring home a piece of India's heritage.
              Handcrafted, authentic, and timeless.
            </p>
          </div>
          <Link to="/add-product">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2">
              <span className="text-xl">+</span> List Your Product
            </button>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <FiSearch className="absolute left-4 top-3.5 text-gray-400 text-lg" />
            <input
              type="search"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-100 outline-none transition"
              placeholder="Search specific items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <select
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-100 outline-none appearance-none cursor-pointer text-gray-700 font-medium"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="price">Price: Low to High</option>
                <option value="name">Name: A-Z</option>
              </select>
              <FiFilter className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <div className="inline-block p-4 rounded-full bg-indigo-50 text-indigo-200 mb-4 text-4xl">
              <FiShoppingCart />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sorted.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <Link to={`/marketplace/details/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-gray-100 block">
                  <img
                    src={product.main_image || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-indigo-600 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                      Featured
                    </span>
                  )}

                  {/* Quick Add Button Overlay */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                    title="Add to Cart"
                    disabled={!product.available || product.inventory <= 0}
                  >
                    <FiPlus size={20} />
                  </button>
                </Link>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      <Link to={`/marketplace/details/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="font-bold text-indigo-600">₹{product.price}</p>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {product.short_description || product.description}
                  </p>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <span>{product.product_type}</span>
                    <span className={product.inventory > 0 ? "text-green-600" : "text-red-600"}>
                      {product.inventory > 0 ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsOverview;
