import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => alerts !== null && alerts.length > 0 &&  (
    <section className='container'>
    {alerts.map(alert => (
        <div className={`alert alert-${alert.alertType}`} key={alert.id}>
            { alert.msg }
        </div>
    ))}
    </section>
);

Alert.propTypes = {
    alerts: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    alerts: state.alert
});
export default connect(mapStateToProps)(Alert);