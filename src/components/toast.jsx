import { useState, useEffect, useCallback } from "react";
import "./toast.css";

// ── useToast Hook ─────────────────────────────────────────────────────────────
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, title, message }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    return id;
  }, []);

  // Helper shorthands — mirrors react-hot-toast API feel
  const toast = {
    loading: (message) => addToast({ type: "loading", title: "Please wait",  message }),
    success: (message, opts)   => {
      if (opts?.id) {
        // Replace an existing loading toast
        setToasts((prev) =>
          prev.map((t) =>
            t.id === opts.id ? { ...t, type: "success", title: "Success", message } : t
          )
        );
        return opts.id;
      }
      return addToast({ type: "success", title: "Success", message });
    },
    error: (message, opts) => {
      if (opts?.id) {
        setToasts((prev) =>
          prev.map((t) =>
            t.id === opts.id ? { ...t, type: "error", title: "Error", message } : t
          )
        );
        return opts.id;
      }
      return addToast({ type: "error", title: "Error", message });
    },
  };

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, removeToast };
};

// ── Single Toast Item ─────────────────────────────────────────────────────────
const ToastItem = ({ id, type, title, message, onClose }) => {
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => onClose(id), 280);
  }, [id, onClose]);

  // Auto-dismiss: loading stays until replaced, success/error auto-close
  useEffect(() => {
    if (type === "loading") return;
    const timer = setTimeout(handleClose, 6000);  
    return () => clearTimeout(timer);
  }, [type, handleClose]);

  const iconMap = {
    loading: (
      <svg className="toast-icon toast-spin" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
      </svg>
    ),
    success: (
      <svg className="toast-icon" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" />
        <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg className="toast-icon" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <div className={`mc-toast mc-toast--${type}${exiting ? " mc-toast--exit" : ""}`}>
      <span className="mc-toast__icon">{iconMap[type]}</span>
      <div className="mc-toast__content">
        <div className="mc-toast__title">{title}</div>
        <div className="mc-toast__msg">{message}</div>
      </div>
      {type !== "loading" && (
        <button className="mc-toast__close" onClick={handleClose}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ── Toast Container ───────────────────────────────────────────────────────────
export const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;
  return (
    <div className="mc-toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onClose={removeToast} />
      ))}
    </div>
  );
};