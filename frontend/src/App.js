import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Product from './pages/Product/Product';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import AuthModal from './components/AuthModal/AuthModal';

const Header = () => {
  const { user, setShowAuthModal, logout } = useAuth();

  const headerStyle = {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const navStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const linkStyle = {
    marginRight: '20px',
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '16px'
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: user ? '#dc3545' : '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: '10px'
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <div>
          <Link to="/" style={linkStyle}>Главная</Link>
          <Link to="/catalog" style={linkStyle}>Каталог</Link>
        </div>

        <div style={userInfoStyle}>
          {user ? (
            <>
              <Link to="/profile" style={linkStyle}>
                👤 {user.name}
              </Link>
              <button style={buttonStyle} onClick={logout}>
                Выйти
              </button>
            </>
          ) : (
            <button 
              style={buttonStyle}
              onClick={() => setShowAuthModal(true)}
            >
              Войти / Регистрация
            </button>
          )}
          <Link to="/cart" style={linkStyle}>🛒 Корзина</Link>
        </div>
      </nav>
    </header>
  );
};

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
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;