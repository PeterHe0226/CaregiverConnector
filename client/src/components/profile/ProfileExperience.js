import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileExperience = ({ experience }) => {
    const { company, title, location, current, to, from, description } = experience;
  return (
    <div>
      <h3 className="text-dark">{company}</h3>
      <p>
          <Moment format='YYYY/MM/DD'>{from}</Moment> - { current ? 'Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
      </p>
      <p>
          <strong>Postion: </strong> {title}
      </p>
       <p>
      <strong>Location: </strong> {location}
      </p>
       <p>
          <strong>Description: </strong> {description}
      </p>
    </div>
  )
}

ProfileExperience.propTypes = {
    experience: PropTypes.object.isRequired,
}

export default ProfileExperience
