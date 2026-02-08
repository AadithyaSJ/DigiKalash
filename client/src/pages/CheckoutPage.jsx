import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCreditCard, FiMapPin, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success

    if (cart.length === 0 && step !== 3) {
        navigate('/cart');
        return null;
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newOrder = {
                id: `ORD-${Date.now()}`,
                date: new Date().toISOString(),
                items: cart,
                total: getCartTotal() * 1.18, // Including tax
                status: 'Processing',
                paymentMethod: e.target.payment.value || 'Credit Card'
            };

            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

            setLoading(false);
            setStep(3);
            clearCart();
            toast.success('Order placed successfully!');
        }, 2000);
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-4xl mx-auto mb-6">
                        <FiCheckCircle />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 mb-8">
                        Thank you for supporting our artisans. Your order has been placed successfully and will be shipped soon.
                    </p>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
                    >
                        Continue Exploring
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                    {/* Address Section */}
                    <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${step === 1 ? "border-indigo-500 ring-2 ring-indigo-100" : "border-gray-100 opacity-60"}`}>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</div>
                            Shipping Address
                        </h2>
                        {step === 1 && (
                            <form id="address-form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Full Name" className="p-3 border rounded-lg w-full" />
                                    <input required type="text" placeholder="Phone Number" className="p-3 border rounded-lg w-full" />
                                    <input required type="text" placeholder="Street Address" className="p-3 border rounded-lg w-full md:col-span-2" />
                                    <input required type="text" placeholder="City" className="p-3 border rounded-lg w-full" />
                                    <input required type="text" placeholder="Postal Code" className="p-3 border rounded-lg w-full" />
                                </div>
                                <button type="submit" className="mt-4 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
                                    Continue to Payment
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Payment Section */}
                    <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${step === 2 ? "border-indigo-500 ring-2 ring-indigo-100" : "border-gray-100 opacity-60"}`}>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">2</div>
                            Payment Method
                        </h2>
                        {step === 2 && (
                            <form onSubmit={handlePlaceOrder}>
                                <div className="space-y-3 mb-6">
                                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-indigo-300 transition bg-indigo-50 border-indigo-200">
                                        <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-indigo-600" />
                                        <FiCreditCard className="text-xl text-indigo-600" />
                                        <span className="font-bold text-gray-700">Credit / Debit Card</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-gray-300 transition">
                                        <input type="radio" name="payment" className="w-5 h-5 text-indigo-600" />
                                        <span className="font-bold text-gray-700">UPI / Netbanking</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-gray-300 transition">
                                        <input type="radio" name="payment" className="w-5 h-5 text-indigo-600" />
                                        <FiTruck className="text-xl text-gray-500" />
                                        <span className="font-bold text-gray-700">Cash on Delivery</span>
                                    </label>
                                </div>

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setStep(1)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition">Back</button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg disabled:opacity-50"
                                    >
                                        {loading ? "Processing..." : `Pay ₹${(getCartTotal() * 1.18).toFixed(2)}`}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-3 text-sm">
                                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <img src={item.main_image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800 line-clamp-1">{item.name}</p>
                                        <p className="text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span>₹{getCartTotal().toFixed(2)}</span></div>
                            <div className="flex justify-between text-green-600"><span>Shipping</span><span>Free</span></div>
                            <div className="flex justify-between"><span>Tax (18%)</span><span>₹{(getCartTotal() * 0.18).toFixed(2)}</span></div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span>Total</span><span>₹{(getCartTotal() * 1.18).toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;
