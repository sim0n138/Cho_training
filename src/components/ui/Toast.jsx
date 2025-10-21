/**
 * Toast notification system
 * Lightweight alternative to react-hot-toast
 */
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Toast.css';

// Toast manager singleton
class ToastManager {
  constructor() {
    this.listeners = new Set();
    this.toasts = [];
    this.nextId = 0;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  add(toast) {
    const id = this.nextId++;
    const newToast = { ...toast, id };
    this.toasts.push(newToast);
    this.notify();
    return id;
  }

  remove(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

const toastManager = new ToastManager();

/**
 * Toast API
 */
export const toast = {
  success: (message, duration = 3000) => {
    return toastManager.add({ message, type: 'success', duration });
  },

  error: (message, duration = 4000) => {
    return toastManager.add({ message, type: 'error', duration });
  },

  info: (message, duration = 3000) => {
    return toastManager.add({ message, type: 'info', duration });
  },

  warning: (message, duration = 3000) => {
    return toastManager.add({ message, type: 'warning', duration });
  },

  loading: (message) => {
    return toastManager.add({ message, type: 'loading', duration: null });
  },

  dismiss: (id) => {
    toastManager.remove(id);
  },

  clear: () => {
    toastManager.clear();
  },
};

/**
 * Individual Toast Component
 */
function ToastItem({ toast, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // Match animation duration
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'loading':
        return '⟳';
      default:
        return '';
    }
  };

  return (
    <div
      className={`toast toast-${toast.type} ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{toast.message}</div>
      {toast.duration && (
        <button
          className="toast-close"
          onClick={handleDismiss}
          aria-label="Закрыть уведомление"
        >
          ×
        </button>
      )}
    </div>
  );
}

ToastItem.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'loading'])
      .isRequired,
    duration: PropTypes.number,
  }).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

/**
 * Toast Container Component
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const handleDismiss = useCallback((id) => {
    toastManager.remove(id);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toastItem) => (
        <ToastItem
          key={toastItem.id}
          toast={toastItem}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
}

export default toast;
