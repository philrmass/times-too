import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/PerMinute.module.css';

function PerMinute({
  perMinuteOptions,
  perMinute,
  setPerMinute,
}) {
  function buildButtons() {
    return perMinuteOptions.map((option) => {
      const selected = perMinute === option ? styles.selected : '';

      return (
        <button
          key={option}
          className={`${styles.button} ${selected}`}
          onClick={() => setPerMinute(option)}
        >
          {option}
        </button>
      );
    });
  }

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        Questions Per Minute
      </div>
      <div className={styles.buttons}>
        {buildButtons()}
      </div>
    </div>
  );
}

PerMinute.propTypes = {
  perMinuteOptions: PropTypes.arrayOf(PropTypes.number),
  perMinute: PropTypes.number,
  setPerMinute: PropTypes.func.isRequired,
};

export default PerMinute;
