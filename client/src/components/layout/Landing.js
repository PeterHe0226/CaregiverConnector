import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Caregiver Connector</h1>
          <p className="lead">
            Create a caregiver profile/portfolio, share posts and get help from
            other caregivers
          </p>
          <div clasName="buttons">
            <Link to="/register" clasName="btn btn-primary">Sign Up</Link>
            <Link to="/login" clasName="btn btn-light">Login</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Landing
