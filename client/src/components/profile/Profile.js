import React, { Fragment, useEffect} from 'react';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfileByID } from '../../actions/profile';
import { useParams, Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';



const Profile = ({ getProfileByID, auth, profile: { profile, loading }  }) => {
    const { id } = useParams();
    console.log(id);
    useEffect(() => {
        getProfileByID(id);
    }, [getProfileByID, id]);
  return (
    <Fragment>
    <section className='container'>
      {profile === null || loading ? <Spinner /> : <Fragment>
          <Link to='/profiles' className='btn btn-light'>Back to Profiles</Link>
           {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && 
          (<Link to='/edit-profile' className='btn btn-dark'>Edit Profile</Link>)
          }
          <div className="profile-grid my-1">
              <ProfileTop profile={profile} />
              <ProfileAbout profile={profile} />
              <div className="profile-exp bg-white p-2">
                  <h2 className="text-primary">Experiences</h2>
                  {(profile.experience && profile.experience.length > 0) ? (<Fragment>
                      {profile.experience.map(experience => (
                          <ProfileExperience key={experience._id} experience={experience} />
                      ))}
                  </Fragment>) : (<h4>No Experience Credentials</h4>)}
              </div>

               <div className="profile-edu bg-white p-2">
                  <h2 className="text-primary">Education</h2>
                  {(profile.education && profile.education.length > 0) ? (<Fragment>
                      {profile.education.map(education => (
                          <ProfileEducation key={education._id} education={education} />
                      ))}
                  </Fragment>) : (<h4>No Education History</h4>)}
              </div>

              {profile.githubusername && (
                  <ProfileGithub username={profile.githubusername}/>
              )}
          </div>
          </Fragment>}
    </section>
    </Fragment>
  )
}

Profile.propTypes = {
    getProfileByID: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});
export default connect(mapStateToProps, { getProfileByID })(Profile);