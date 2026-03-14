import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ServiceProvider } from './context/ServiceContext'; // ✅ Добавьте импорт
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Product from './pages/Product/Product';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import Service from './pages/Service/Service'; // ✅ Импорт страницы сервиса
import ServiceDetail from './pages/Service/ServiceDetail'; // ✅ Импорт деталей заявки
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
        <Route path="/service" element={<Service />} /> {/* ✅ Маршрут для списка заявок */}
        <Route path="/service/:id" element={<ServiceDetail />} /> {/* ✅ Маршрут для деталей заявки */}
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ServiceProvider> {/* ✅ Добавьте ServiceProvider */}
            <AppContent />
          </ServiceProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;