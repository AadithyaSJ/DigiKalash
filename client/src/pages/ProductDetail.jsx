import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [heritageSite, setHeritageSite] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingSite, setLoadingSite] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoadingProduct(true);
        const res = await API.get(`/marketplace/products/${id}/`);
        setProduct(res.data);
        console.log(res.data);
        
        setLoadingProduct(false);
      } catch {
        setError('Failed to load product.');
        setLoadingProduct(false);
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    async function fetchSite() {
      if (product && product.site) {
        try {
          setLoadingSite(true);
          const res = await API.get(`/heritage/sites/${product.site}/`);
          setHeritageSite(res.data);
          setLoadingSite(false);
        } catch {
          setLoadingSite(false);
        }
      }
    }
    fetchSite();
  }, [product]);

  if (loadingProduct)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold mt-8">{error}</div>
    );

  if (!product)
    return (
      <div className="text-center text-gray-500 mt-8">No product found.</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Image Gallery Section */}
        <div className="col-span-1">
          <div className="aspect-w-4 aspect-h-5 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            {product.main_image ? (
              <img
                src={product.main_image}
                alt={product.name}
                className="object-cover object-center w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300">
                No Image Available
              </div>
            )}
          </div>
          {/* Placeholder for additional images if any */}
          {product.images && product.images.length > 0 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {product.images.map((img) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={img.alt_text || "Product image"}
                  className="w-20 h-20 object-cover rounded border border-gray-300 cursor-pointer hover:ring-2 hover:ring-indigo-500"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="col-span-2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{product.name}</h1>
            <p className="text-lg text-gray-700 whitespace-pre-line">{product.description || "No description available."}</p>

            <div className="mt-6 space-y-4 text-gray-800">
              <div>
                <span className="font-semibold">Price:</span>{" "}
                <span className="text-green-600 text-2xl">₹{product.price}</span>
              </div>
              <div>
                <span className="font-semibold">Type:</span> {product.product_type}
              </div>
              <div>
                <span className="font-semibold">Inventory:</span> {product.inventory}
              </div>
              <div>
                <span className="font-semibold">Availability:</span>{" "}
                {product.available ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
              <div>
                <span className="font-semibold">SKU:</span> {product.sku || "N/A"}
              </div>
              {/* <div>
                <span className="font-semibold">Featured:</span>{" "}
                {product.featured ? "Yes" : "No"}
              </div> */}
              <div>
                <span className="font-semibold">Seller:</span>{" "}
                {product.seller?.display_name || "N/A"}
              </div>
              {heritageSite && !loadingSite && (
                <div>
                  <span className="font-semibold">Heritage Site:</span>{" "}
                  <Link
                    to={`/sites/${heritageSite.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {heritageSite.name}
                  </Link>
                </div>
              )}
            </div>

            {product.video_url && (
              <div className="mt-8">
                <a
                  href={product.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded shadow transition"
                >
                  ▶ Watch Product Video
                </a>
              </div>
            )}
          </div>

          {/* Contact Seller button */}
<div className="mt-10">
  <Link to={`/products/inquire/${product.id}`}>
    <button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-extrabold px-10 py-4 rounded shadow-lg transition">
      Contact Seller
    </button>
  </Link>
</div>

{/* WhatsApp Enquiry Button */}
{product.seller?.phone && (
  <div className="mt-4">
    <a
      href={
        "https://wa.me/" +
        product.seller.phone.replace(/\D/g, "") +
        "?text=" +
        encodeURIComponent(
          `Hello, I am interested in your product "${product.name}" listed here: ${window.location.href}`
        )
      }
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow transition"
    >
      Enquire on WhatsApp
    </a>
  </div>
)}


        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
