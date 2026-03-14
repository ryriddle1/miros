import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🚚',
      title: 'Бесплатная доставка',
      description: 'При заказе от 5000 ₽'
    },
    {
      icon: '💰',
      title: 'Гарантия лучшей цены',
      description: 'Найдете дешевле - вернем разницу'
    },
    {
      icon: '🛡️',
      title: 'Гарантия качества',
      description: 'Только оригинальная продукция'
    },
    {
      icon: '⚡',
      title: 'Быстрая доставка',
      description: 'Отправка в день заказа'
    }
  ];

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Добро пожаловать в miros
          </h1>
          <p className={styles.subtitle}>
            Дизайн — бомба, начинка — ядерная.
          </p>
          <button 
            className={styles.ctaButton}
            onClick={() => navigate('/catalog')}
          >
            Начать покупки →
          </button>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>
          Почему выбирают нас?
        </h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;