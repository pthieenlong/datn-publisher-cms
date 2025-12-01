import { CheckCircle2, XCircle, Info, AlertCircle, X } from "lucide-react";
import { useToastStore } from "./toastStore";
import "./ToastContainer.scss";

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="toast-icon" />;
      case "error":
        return <XCircle className="toast-icon" />;
      case "warning":
        return <AlertCircle className="toast-icon" />;
      case "info":
      default:
        return <Info className="toast-icon" />;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            {getIcon(toast.type)}
            <div className="toast-text">
              <div className="toast-title">{toast.title}</div>
              {toast.message && (
                <div className="toast-message">{toast.message}</div>
              )}
            </div>
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Đóng thông báo"
          >
            <X className="toast-close-icon" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
