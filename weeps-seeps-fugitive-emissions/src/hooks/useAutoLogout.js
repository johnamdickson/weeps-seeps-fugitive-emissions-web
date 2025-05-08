import { useEffect, useRef, useCallback, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

/**
 * Auto-logout hook: warns the user before session timeout and logs them out after delay.
 *
 * @param {Object} config
 * @param {number} config.timeoutMs - Total session duration (default 30 min)
 * @param {number} config.warningMs - Time before logout to show warning (default 1 min)
 * @returns {{ showWarning: boolean, stayLoggedIn: () => void, countdown: number }}
 */
const useAutoLogout = ({
  timeoutMs = 30 * 60 * 1000, // 30 minutes
  warningMs = 60 * 1000       // 1 minute
} = {}) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const timeoutRef = useRef();      // Full timeout
  const warningRef = useRef();      // Warning trigger timeout
  const countdownRef = useRef();    // Countdown interval

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(Math.floor(warningMs / 1000));

  /**
   * Clears all active timers and intervals
   */
  const clearTimers = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);
    clearInterval(countdownRef.current);
  };

  /**
   * Starts countdown when warning is triggered
   * Shows warning UI and logs out at 0
   */
  const startCountdown = () => {
    setCountdown(Math.floor(warningMs / 1000));

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setShowWarning(false);
          navigate("/");

          signOut(auth).catch(err =>
            console.error("❌ Auto logout failed:", err)
          );

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Resets session timers:
   * - warning before logout
   * - final logout as fallback
   */
  const resetTimer = useCallback(() => {
    clearTimers();
    setShowWarning(false);

    // Trigger warning countdown before full timeout
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, timeoutMs - warningMs);

    // Hard logout after full timeout (fallback)
    timeoutRef.current = setTimeout(() => {
      clearInterval(countdownRef.current);
      setShowWarning(false);
      navigate("/");

      signOut(auth).catch(err =>
        console.error("❌ Auto logout fallback failed:", err)
      );
    }, timeoutMs);
  }, [auth, navigate, timeoutMs, warningMs]);

  /**
   * Sets or clears timers on auth state changes
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
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

  /**
   * Public handler for "Stay Logged In" action (e.g., from toast)
   */
  const stayLoggedIn = () => {
    resetTimer();
  };

  return {
    showWarning,
    stayLoggedIn,
    countdown
  };
};

export default useAutoLogout;
