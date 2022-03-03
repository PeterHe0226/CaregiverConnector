import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';

const Profiles = ({ profile, getProfiles }) => {
    const { profiles, loading } = profile;
    useEffect(() => {
        getProfiles();
    }, [getProfiles]);
  return (
    <Fragment>
      <section className='container'>
      { (loading || profiles === null) ? <Spinner /> : (<Fragment>
          <h1 className="large text-primary">Caregivers</h1>
          <p className="lead">
              <i className="fab fa-connectdevelop"></i> Browse and Connect with Caregivers
          </p>
          <div className="profiles">
              {profiles.length > 0 ? (
                  profiles.map(profile => (
                    <ProfileItem key={profile._id} profile={profile} />
                  ))
              ) : <h4> No Profiles Found...</h4>}
          </div>
          </Fragment>)}
        </section>
    </Fragment>
  )
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
