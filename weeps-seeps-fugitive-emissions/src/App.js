import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext'; // ⬅️ Import ToastProvider
import Debug from "./pages/Debug";
import LoadingOverlay from "./components/LoadingOverlay";
import SessionInfoBar from "./components/SessionInfoBar";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
        <LoadingOverlay/> 
          <Navbar />
          <SessionInfoBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/debug" element={<Debug />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
