import React, { useEffect, useState } from "react";
import { FiPackage, FiCalendar, FiMapPin, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(savedOrders);
    }, []);

    const toggleOrder = (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };

    if (orders.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl mx-auto mb-4">
                    <FiPackage />
                </div>
                <h2 className="text-xl font-bold text-gray-800">No Orders Yet</h2>
                <p className="text-gray-500 mt-2">Looks like you haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

            {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Order Header */}
                    <div
                        className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => toggleOrder(order.id)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <FiPackage size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{order.id}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <FiCalendar size={14} />
                                    <span>{new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <button
                                className="text-gray-400 p-2 rounded-full hover:bg-gray-200 transition"
                                onClick={(e) => { e.stopPropagation(); toggleOrder(order.id); }}
                            >
                                {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                        </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedOrder === order.id && (
                        <div className="border-t border-gray-100 p-6 bg-gray-50">
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <FiMapPin className="text-gray-500" /> Shipping Details
                                </h4>
                                <p className="text-sm text-gray-600">Payment Method: {order.paymentMethod}</p>
                                {/* You can add more address info if captured */}
                            </div>

                            <h4 className="font-bold text-gray-800 mb-3">Items Ordered</h4>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.main_image || "/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <p className="font-bold text-gray-900 text-sm">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
