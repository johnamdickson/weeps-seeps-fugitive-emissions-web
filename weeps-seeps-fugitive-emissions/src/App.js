import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { AuthProvider } from './contexts/AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* other routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;