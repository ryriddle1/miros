import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            miros
          </div>
          
          <div className={styles.links}>
            <div className={styles.column}>
              <h4>Информация</h4>
              <ul>
                <li><a href="/about">О нас</a></li>
              </ul>
            </div>
            
            <div className={styles.column}>
              <h4>Контакты</h4>
              <ul>
                <li>📞 8 (967) 702-67-04</li>
                <li>📧 support@miros.ru</li>
                <li>📍 г. Пенза, ул. Какаду, 26</li>
              </ul>
            </div>
            
            <div className={styles.column}>
              <h4>Мы в соцсетях</h4>
              <div className={styles.social}>
                <a href="https://vk.com/rostyslav23" target="_blank" rel="noopener noreferrer">📘</a>
                <a href="https://vk.com/delphyna_r" target="_blank" rel="noopener noreferrer">💬</a>
                <a href="https://github.com/ryriddle1/miros" target="_blank" rel="noopener noreferrer">📷</a>
                <a href="https://vk.com/official_kepler" target="_blank" rel="noopener noreferrer">🐧</a>       
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>© {currentYear} miros. Все права защищены.</p>
          <p className={styles.policy}>
            <a href="/privacy">Политика конфиденциальности</a> | 
            <a href="/terms"> Пользовательское соглашение</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;