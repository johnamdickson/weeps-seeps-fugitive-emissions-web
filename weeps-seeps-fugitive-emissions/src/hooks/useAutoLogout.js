import { useEffect, useRef, useCallback, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

/**
 * Auto-logout hook: warns the user before session timeout and logs out after delay.
 *
 * @param {Object} config
 * @param {number} config.timeoutMs - Total session duration (default 15 min)
 * @param {number} config.warningMs - Time before logout to warn the user (default 1 min)
 * @returns {{ showWarning: boolean, stayLoggedIn: () => void, countdown: number }}
 */
const useAutoLogout = ({
  timeoutMs = 30 * 60 * 1000,  // Default 30 minutes
  warningMs = 60 * 1000       // Default 1 minute
} = {}) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const timeoutRef = useRef();
  const warningRef = useRef();
  const countdownRef = useRef();

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(Math.floor(warningMs / 1000));

  // Clears all timers
  const clearTimers = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);
    clearInterval(countdownRef.current);
  };

  // Starts countdown and manages end of session
  const startCountdown = () => {
    setCountdown(Math.floor(warningMs / 1000));
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setShowWarning(false); // Hide warning when time's up
          navigate("/");         // Redirect before logout
          signOut(auth)
            .catch(err => console.error("❌ Auto logout failed:", err));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Resets the session timers
  const resetTimer = useCallback(() => {
    clearTimers();
    setShowWarning(false);

    // Start warning timer
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, timeoutMs - warningMs);

    // Force logout after total timeout (fallback, in case countdown is skipped)
    timeoutRef.current = setTimeout(() => {
      clearInterval(countdownRef.current);
      setShowWarning(false);
      navigate("/");
      signOut(auth).catch((err) =>
        console.error("❌ Auto logout fallback failed:", err)
      );
    }, timeoutMs);
  }, [auth, navigate, timeoutMs, warningMs]);

  // Trigger/reset timers on auth state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        resetTimer();
      } else {
        clearTimers();
        setShowWarning(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimers();
    };
  }, [auth, resetTimer]);

  // Public method to reset timer from toast button
  const stayLoggedIn = () => {
    resetTimer();
  };

  return { showWarning, stayLoggedIn, countdown };
};

export default useAutoLogout;
