import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/GameControls.module.css';

function GameControls({
  isPractice,
  isTest,
  startPractice,
  startTest,
  stop,
}) {
  function buildPracticeButton() {
    const text = isPractice ? 'Stop' : 'Practice';
    const action = isPractice ? stop : startPractice;
    const style = isPractice ? styles.stop : styles.start;

    return (
      <button
        className={`${styles.button} ${style}`}
        disabled={isTest}
        onClick={action}
      >
        {text}
      </button>
    );
  }

  function buildTestButton() {
    const text = isTest ? 'Stop' : 'Start Test';
    const action = isTest ? stop : startTest;
    const style = isTest ? styles.stop : styles.start;

    return (
      <button
        className={`${styles.button} ${style}`}
        disabled={isPractice}
        onClick={action}
      >
        {text}
      </button>
    );
  }

  return (
    <div className={styles.main}>
      {buildPracticeButton()}
      {buildTestButton()}
    </div>
  );
}

GameControls.propTypes = {
  isPractice: PropTypes.bool.isRequired,
  isTest: PropTypes.bool.isRequired,
  startPractice: PropTypes.func.isRequired,
  startTest: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
};

export default GameControls;
