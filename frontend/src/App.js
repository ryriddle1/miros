import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ServiceProvider } from './context/ServiceContext';
import { PCBuilderProvider } from './context/PCBuilderContext'; 
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Product from './pages/Product/Product';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import Service from './pages/Service/Service';
import ServiceDetail from './pages/Service/ServiceDetail';
import PCBuilder from './pages/PCBuilder/PCBuilder'; 
import AuthModal from './components/AuthModal/AuthModal';
import './index.css';

const AppContent = () => {
  return (
    <>
      <Header />
      <AuthModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/service" element={<Service />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/pc-builder" element={<PCBuilder />} /> 
      </Routes>
      <Footer /> 
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ServiceProvider>
            <PCBuilderProvider> 
              <AppContent />
            </PCBuilderProvider>
          </ServiceProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;