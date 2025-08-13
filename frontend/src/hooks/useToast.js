import { useState, useCallback } from 'react';

export const useToast = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const ToastContainer = () => (
    <div className="toast-container">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`toast toast-${notification.type}`}
        >
          <span className="toast-message">{notification.message}</span>
          <button 
            className="toast-close"
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );

  return { showNotification, ToastContainer };
};
