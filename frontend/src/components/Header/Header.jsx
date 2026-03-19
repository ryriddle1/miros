import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styles from './Header.module.css';

const Header = () => {
  const { user, setShowAuthModal, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logo}>
          🛍️ miros
        </NavLink>

        <div className={styles.navLinks}>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
            }
          >
            Главная
          </NavLink>
          
          <NavLink 
            to="/catalog" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
            }
          >
            Каталог
          </NavLink>

          {/* Ссылка на сервисный центр */}
          <NavLink 
            to="/service" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
            }
          >
            🔧 Сервис
          </NavLink>

          {/* ✅ Новая ссылка на конструктор ПК */}
          <NavLink 
            to="/pc-builder" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
            }
          >
            🖥️ Конструктор ПК
          </NavLink>

          {user && (
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
              }
            >
              👤 {user.name}
            </NavLink>
          )}

          <button 
            className={styles.cartButton}
            onClick={() => navigate('/cart')}
          >
            🛒 Корзина
            {getTotalItems() > 0 && (
              <span className={styles.cartBadge}>{getTotalItems()}</span>
            )}
          </button>

          {user ? (
            <div className={styles.userMenu}>
              <button 
                className={styles.logoutButton}
                onClick={logout}
              >
                Выйти
              </button>
            </div>
          ) : (
            <button 
              className={styles.loginButton}
              onClick={() => setShowAuthModal(true)}
            >
              Войти
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;