// contexts/ToastContext.js
import { createContext, useContext, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    title: "Notification",
    message: "",
    variant: "success",
    autohide: true,
    delay: 5000,
  });

  const showToast = (
    message,
    variant = "success",
    title = "Notification",
    options = {} 
  ) => {
    setToast({
      show: true,
      title,
      message,
      variant,
      autohide: options.autohide ?? true,
      delay: options.delay ?? 5000,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };
  
  const handleClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={toast.show}
          bg={toast.variant}
          onClose={handleClose}
          autohide={toast.autohide}
          delay={toast.delay}
        >
          <Toast.Header>
            <strong className="me-auto ">{toast.title}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
