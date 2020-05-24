import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/GameControls.module.css';

function GameControls({
  isPlaying,
  start,
  quit,
}) {
  return (
    <div className={styles.main}>
      <button
        className={`${styles.button} ${styles.quit}`}
        disabled={!isPlaying}
        onClick={quit}
      >
        Quit
      </button>
      <button
        className={`${styles.button} ${styles.start}`}
        disabled={isPlaying}
        onClick={start}
      >
        Start
      </button>
    </div>
  );
}

GameControls.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  start: PropTypes.func.isRequired,
  quit: PropTypes.func.isRequired,
};

export default GameControls;
