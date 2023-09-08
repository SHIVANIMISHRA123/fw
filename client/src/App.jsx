import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Signup from './Signup'; // Import your Signup component
import Login from './Login'; // Import your Login component
import Home from './Home'; // Import your Home component (formerly "Get Started")
import Form from './Form';
import Dashboard from './Dashboard'; // Import your Form component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} /> {/* Route for Home/Get Started */}
          <Route path="/form" element={<Form />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



