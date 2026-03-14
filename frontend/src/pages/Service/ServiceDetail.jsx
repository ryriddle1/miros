import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useService } from '../../context/ServiceContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Service.module.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRequestById, addComment, updateRequestStatus } = useService();
  const [comment, setComment] = React.useState('');

  const request = getRequestById(parseInt(id));

  if (!user) {
    navigate('/');
    return null;
  }

  if (!request) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Заявка не найдена</h2>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/service')}
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Ожидает', class: styles.statusPending },
      in_progress: { text: 'В работе', class: styles.statusProgress },
      completed: { text: 'Выполнен', class: styles.statusCompleted },
      cancelled: { text: 'Отменён', class: styles.statusCancelled }
    };
    return badges[status] || badges.pending;
  };

  const getUrgencyLabel = (urgency) => {
    const labels = {
      low: 'Низкая',
      normal: 'Средняя',
      high: 'Высокая',
      urgent: 'Срочная'
    };
    return labels[urgency] || labels.normal;
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      addComment(request.id, comment);
      setComment('');
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => navigate('/service')}
      >
        ← Назад к списку
      </button>

      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <h1>Заявка на ремонт №{request.id}</h1>
          <span className={`${styles.statusBadge} ${getStatusBadge(request.status).class}`}>
            {getStatusBadge(request.status).text}
          </span>
        </div>

        <div className={styles.detailInfo}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Дата создания:</label>
              <span>{new Date(request.createdAt).toLocaleString('ru-RU')}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Последнее обновление:</label>
              <span>{new Date(request.updatedAt).toLocaleString('ru-RU')}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Устройство:</label>
              <span>{request.brand} {request.model}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Тип:</label>
              <span>{request.deviceType}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Срочность:</label>
              <span className={`${styles.urgencyBadge} ${styles[`urgency${request.urgency}`]}`}>
                {getUrgencyLabel(request.urgency)}
              </span>
            </div>
          </div>

          <div className={styles.problemSection}>
            <h3>Проблема</h3>
            <p>{request.issue}</p>
          </div>

          {request.description && (
            <div className={styles.descriptionSection}>
              <h3>Подробное описание</h3>
              <p>{request.description}</p>
            </div>
          )}
        </div>

        {/* История изменений */}
        <div className={styles.historySection}>
          <h3>История заявки</h3>
          <div className={styles.timeline}>
            {request.history.map((event, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineDate}>
                  {new Date(event.date).toLocaleString('ru-RU')}
                </div>
                <div className={styles.timelineContent}>
                  {event.status === 'comment' ? (
                    <p className={styles.commentText}>💬 {event.comment}</p>
                  ) : (
                    <p>
                      Статус изменён на: {' '}
                      <span className={`${styles.statusBadge} ${styles[`status${event.status}`]}`}>
                        {getStatusBadge(event.status).text}
                      </span>
                      {event.comment && <span className={styles.commentNote}> — {event.comment}</span>}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Добавление комментария */}
        <div className={styles.commentSection}>
          <h3>Добавить комментарий</h3>
          <div className={styles.commentForm}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введите ваш комментарий..."
              rows="3"
            />
            <button 
              onClick={handleAddComment}
              className={styles.submitCommentButton}
              disabled={!comment.trim()}
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;