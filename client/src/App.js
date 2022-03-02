import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/layout/auth/Login';
import Register from './components/layout/auth/Register';
import React, { Fragment, useEffect } from 'react';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import AddEducation from './components/profile-forms/AddEducation';


const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    
    store.dispatch(loadUser());
  }, []);

  return (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Alert />
        <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />  
              <Route path="/profiles" element={<Profiles />} />   
              <Route path="/profile/:id" element={<Profile />} />  
              <Route path="dashboard" element={<PrivateRoute component={Dashboard} />} />  
              <Route path="create-profile" element={<PrivateRoute component={CreateProfile} />} /> 
              <Route path="edit-profile" element={<PrivateRoute component={EditProfile} />} />  
              <Route path="add-experience" element={<PrivateRoute component={AddExperience} />} /> 
              <Route path="add-education" element={<PrivateRoute component={AddEducation} />} /> 
              <Route path="posts" element={<PrivateRoute component={Posts} />} />
        </Routes>
      </Fragment>
    </Router>
  </Provider>
)};

export default App;
