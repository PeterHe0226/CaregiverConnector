import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({ getCurrentProfile, deleteAccount, auth: { user }, profile: { profile, loading } }) => {
    useEffect(() => {
        getCurrentProfile();
        //useEffect only once
    },[]);
  return (
    <div>
        <section className='container'>
        {loading && profile===null ? <Spinner /> : <Fragment>
            <h1 className='large text-primary'>
                Dashboard
            </h1>
            <p className="lead">
                <i className='fas fa-user'></i>{' '}
                Welcome { user && user.name}
            </p>
            {profile !== null ? (<Fragment>
                <DashboardActions />
                <Experience experience={profile.experience}/>
                <Education education={profile.education}/>
                <div className="my-2">
                    <button className="btn btn-danger" onClick={() => deleteAccount()}>
                        <i className="fas fa-user-minus"></i> Delete My Account
                    </button>
                </div>
            </Fragment>) : 
            (<Fragment>
                <p>You don't have a profile yet, please add some info to set up a profile.</p>
                <Link to='/create-profile' className="btn btn-primary my-1">Create Profile</Link>
                </Fragment>)}
            </Fragment>}
        </section>
    </div>
  )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);