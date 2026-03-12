import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Product from './pages/Product/Product'; // Добавьте эту строку

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6'
        }}>
          <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
            Главная
          </Link>
          <Link to="/catalog" style={{ textDecoration: 'none', color: '#007bff' }}>
            Каталог
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<Product />} /> {/* Новая страница */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;