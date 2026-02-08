import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeritageSitesPage from "./pages/HeritageSitesPage";
import HeritageEventsPage from "./pages/HeritageEventsPage";
import HomePage from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeritageSiteDetailPage from './pages/HeritageSiteDetailPage';
import ForumPage from './pages/ForumPage';
import ProductsOverview from './pages/ProductsOverview';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import ProductAddedDetails from './pages/ProductAddedDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Run once on app load to read auth token or check auth state
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setLoadingAuth(false);
  }, []);

  if (loadingAuth) {
    // Show loader while auth state initializing
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Toaster position="top-center" toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
            },
          }} />

          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route
                path="/login"
                element={<Login onLogin={() => setIsAuthenticated(true)} />}
              />
              <Route
                path="/register"
                element={<Register />}
              />
              <Route
                path="/home"
                element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={<Dashboard />}
              />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/sites" element={<HeritageSitesPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/marketplace/added/:productId" element={<ProductAddedDetails />} />
              <Route path="/add-product" element={<AddProduct onProductAdded={() => { }} />} />
              <Route path="/marketplace" element={<ProductsOverview />} />
              <Route path="/marketplace/details/:id" element={<ProductDetail />} />
              <Route path="/sites/:siteId" element={<HeritageSiteDetailPage />} />
              <Route path="/heritage/:siteId/events" element={<HeritageEventsPage />} />

              <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
