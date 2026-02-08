import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-4xl mb-6">
                    <FiShoppingBag />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Looks like you haven't added anything to your cart yet. Explore our marketplace to find unique heritage products.
                </p>
                <Link
                    to="/marketplace"
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    Your Shopping Cart <span className="text-lg font-normal text-gray-500">({cart.length} items)</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="flex-grow space-y-6">
                        {cart.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                key={item.id}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6"
                            >
                                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.main_image || "/placeholder.png"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-grow text-center sm:text-left">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        <Link to={`/marketplace/details/${item.id}`} className="hover:text-indigo-600 transition">
                                            {item.name}
                                        </Link>
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-2">{item.product_type} • {item.category_name || "Artisan Craft"}</p>
                                    <div className="text-indigo-600 font-bold text-lg">₹{item.price}</div>
                                </div>

                                <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-2 hover:bg-white rounded-md transition disabled:opacity-50 text-gray-600"
                                        disabled={item.quantity <= 1}
                                    >
                                        <FiMinus size={16} />
                                    </button>
                                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-2 hover:bg-white rounded-md transition text-gray-600"
                                    // Add max based on inventory if needed
                                    >
                                        <FiPlus size={16} />
                                    </button>
                                </div>

                                <div className="text-right min-w-[100px] font-bold text-gray-900">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"
                                    title="Remove Item"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                            </motion.div>
                        ))}

                        <div className="text-right">
                            <button
                                onClick={clearCart}
                                className="text-red-600 font-semibold hover:underline text-sm"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Checkout Summary */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6 border-b border-gray-100 pb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (Estimated)</span>
                                    <span>₹{(getCartTotal() * 0.18).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold text-gray-900 mb-8">
                                <span>Total</span>
                                <span>₹{(getCartTotal() * 1.18).toFixed(2)}</span>
                            </div>

                            <Link to="/checkout" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                                Checkout Now <FiArrowRight />
                            </Link>

                            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Secure Checkout via Stripe/Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
