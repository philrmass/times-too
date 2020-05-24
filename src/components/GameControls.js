import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/GameControls.module.css';

function GameControls({
  isPractice,
  isTest,
  startTest,
  stop,
}) {
  return (
    <div className={styles.main}>
      <button
        className={`${styles.button} ${styles.stop}`}
        disabled={!isTest}
        onClick={stop}
      >
        Practice
      </button>
      <button
        className={`${styles.button} ${styles.startTest}`}
        disabled={isTest}
        onClick={startTest}
      >
        Start Test
      </button>
    </div>
  );
}

GameControls.propTypes = {
  isPractice: PropTypes.bool.isRequired,
  isTest: PropTypes.bool.isRequired,
  startTest: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
};

export default GameControls;
