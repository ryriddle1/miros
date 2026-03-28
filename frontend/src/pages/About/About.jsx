import React from 'react';
import styles from './About.module.css';

const About = () => {
  const team = [
    { name: 'Ростислав', role: 'Backend-разработчик', vk: 'https://vk.com/rostyslav23' },
    { name: 'Мария', role: 'Frontend-разработчик', vk: 'https://vk.com/delphyna_r' },
    
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>О нас</h1>
        <p className={styles.description}>
          miros — это интернет-магазин компьютерной техники и сервисный центр. 
          Мы создаём удобный сервис для покупки и сборки ПК, а также помогаем 
          с ремонтом и обслуживанием вашей техники.
        </p>

        <div className={styles.section}>
          <h2>Наша команда</h2>
          <div className={styles.team}>
            {team.map(member => (
              <div key={member.name} className={styles.teamMember}>
                <div className={styles.avatar}>👤</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <a 
                  href={member.vk} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.vkLink}
                >
                  ВКонтакте
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Контакты</h2>
          <p>📞 8 (967) 702-67-04</p>
          <p>📧 support@miros.ru</p>
          <p>📍 г. Пенза, ул. Какаду, 26</p>
        </div>

        <div className={styles.section}>
          <h2>Социальные сети</h2>
          <div className={styles.socialLinks}>
            <a href="https://vk.com/rostyslav23" target="_blank" rel="noopener noreferrer">ВКонтакте Ростислава</a>
            <a href="https://vk.com/delphyna_r" target="_blank" rel="noopener noreferrer">ВКонтакте Марии</a>
            <a href="https://github.com/ryriddle1/miros" target="_blank" rel="noopener noreferrer">GitHub проекта</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;