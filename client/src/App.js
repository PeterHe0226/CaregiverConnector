import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/layout/auth/Login';
import Register from './components/layout/auth/Register';
import React, { Fragment } from 'react';
import Alert from './components/layout/Alert';
//Redux
import { Provider } from 'react-redux';
import store from './store';



const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Alert />
        <Routes>
            <Route path="/" element={<Landing />} />

              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
          
        </Routes>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
