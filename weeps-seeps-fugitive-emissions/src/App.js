import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin"; // Import Admin page
import Navbar from "./components/Navbar"; // Updated name here
import { AuthProvider } from './contexts/AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> {/* Updated component name */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} /> {/* Admin route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
