import React, { useEffect, useState } from "react";
import { Toast, ToastContainer, Stack } from "react-bootstrap";
import './SessionWarningToast.css';

const SessionWarningToast = ({ countdown, onStayLoggedIn }) => {
  const [timeLeft, setTimeLeft] = useState(countdown);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast show={show} onClose={() => setShow(false)} bg="warning" autohide={false} >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">
            <span className="material-icons me-2 me-3 toast-icon">timer</span>
            Session Timeout
          </strong>
        </Toast.Header >
        <Toast.Body className="text-white flex-column">
            <Stack gap={2} className="col-md-12 mx-auto">
            You’ll be logged out in {timeLeft} seconds.
          <button className="btn btn-sm btn-outline-light toast-button mx-auto w-50" onClick={onStayLoggedIn}>
            Stay Logged In
          </button>
            </Stack>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default SessionWarningToast;
