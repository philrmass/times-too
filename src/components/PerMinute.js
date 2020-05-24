import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/PerMinute.module.css';

function PerMinute({
  perMinuteOptions,
  perMinute,
  setPerMinute,
}) {
  return (
    <div className={styles.main}>PerMinute
      <div>{JSON.stringify(perMinuteOptions)}</div>
      <div>{JSON.stringify(perMinute)}</div>
      <div>{typeof setPerMinute}</div>
    </div>
  );
}

PerMinute.propTypes = {
  perMinuteOptions: PropTypes.arrayOf(PropTypes.number),
  perMinute: PropTypes.number,
  setPerMinute: PropTypes.func.isRequired,
};

export default PerMinute;
