import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/maindashboardlayout' 
import Login from './components/Login/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainDashboardLayout from './components/dashboard/maindashboardlayout';

function App() {
  return (
    <div className="App">
      <div className="d-flex align-items-center mb-2 border-bottom">
        <img
          src="/img/logo.svg"
          alt="GE Healthcare Logo"
          style={{ height: "60px", marginRight: "auto" }}
        />
        {/* <span>GE Healthcare Portal</span> */}
        <div>
          <img src="/img/capge.png" alt="Small Logo" style={{ height: "80px" }} />
        </div>
      </div>     
     <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/maindashboardlayout" element={<MainDashboardLayout />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
