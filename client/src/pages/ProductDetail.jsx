import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { FiChevronLeft, FiShoppingBag, FiMessageCircle, FiVideo, FiCheck, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [heritageSite, setHeritageSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await API.get(`/marketplace/products/${id}/`);
        setProduct(res.data);
        setActiveImage(res.data.main_image);

        if (res.data.site) {
          const siteRes = await API.get(`/heritage/sites/${res.data.site}/`);
          setHeritageSite(siteRes.data);
        }
      } catch (err) {
        console.error("Failed to load product data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
      <Link to="/marketplace" className="text-indigo-600 hover:underline">Back to Marketplace</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
          <FiChevronLeft /> Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Gallery Section */}
          <div className="space-y-4">
            <div className="aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <img
                src={activeImage || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {(product.images && product.images.length > 0) && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveImage(product.main_image)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImage === product.main_image ? "border-indigo-600" : "border-transparent"}`}
                >
                  <img src={product.main_image} className="w-full h-full object-cover" alt="Main" />
                </button>
                {product.images.map(img => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.image)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImage === img.image ? "border-indigo-600" : "border-transparent"}`}
                  >
                    <img src={img.image} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {product.featured && (
                  <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Featured</span>
                )}
                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">{product.product_type}</span>
              </div>
              <h1 className="text-4xl font-display font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>SKU: {product.sku || "N/A"}</span>
                {heritageSite && (
                  <>
                    <span>•</span>
                    <span>Inspired by <Link to={`/sites/${heritageSite.id}`} className="text-indigo-600 hover:underline">{heritageSite.name}</Link></span>
                  </>
                )}
              </div>
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-6">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </div>

            <div className="prose prose-indigo text-gray-600 mb-8 border-t border-b border-gray-100 py-6">
              <p>{product.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Availability</span>
                {product.available && product.inventory > 0 ? (
                  <span className="flex items-center gap-2 text-green-600 font-bold">
                    <FiCheck /> In Stock ({product.inventory} left)
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-red-600 font-bold">
                    <FiX /> Out of Stock
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Seller</span>
                <span className="font-medium text-gray-900">{product.seller?.display_name || "Verified Artisan"}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={!product.available || product.inventory <= 0}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingBag /> {product.available && product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              {product.seller?.phone && (
                <a
                  href={`https://wa.me/${product.seller.phone.replace(/\D/g, "")}?text=Hi, I'm interested in ${product.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                >
                  <FiMessageCircle /> WhatsApp
                </a>
              )}
            </div>

            {product.video_url && (
              <a
                href={product.video_url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center gap-2 text-indigo-600 font-semibold hover:underline"
              >
                <FiVideo /> Watch Product Video
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
