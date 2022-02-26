import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/layout/auth/Login';
import Register from './components/layout/auth/Register';
import React, { Fragment } from 'react';

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Routes>
          <Route path="/" element={<Landing />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
         
      </Routes>
    </Fragment>
  </Router>
);

export default App;
