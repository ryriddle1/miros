import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import productsService from '../../services/products.service';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productsService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.cost - b.cost;
    if (sortBy === 'price_desc') return b.cost - a.cost;
    return a.name.localeCompare(b.name);
  });

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap'
  };

  const searchStyle = {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '300px'
  };

  const selectStyle = {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white'
  };

  const productsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',  // ← 3 колонки
  gap: '20px',
  width: '100%'
};

  if (loading) {
    return <div style={containerStyle}>Загрузка товаров...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Каталог товаров</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchStyle}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="name">По названию</option>
            <option value="price_asc">Сначала недорогие</option>
            <option value="price_desc">Сначала дорогие</option>
          </select>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>
          Товары не найдены
        </p>
      ) : (
        <div style={productsGridStyle}>
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;