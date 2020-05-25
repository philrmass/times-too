import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Questions.module.css';

function Questions({
  questionsOptions,
  questions,
  setQuestions,
}) {
  function buildButtons() {
    return questionsOptions.map((option) => {
      const selected = questions === option ? styles.selected : '';

      return (
        <button
          key={option}
          className={`${styles.button} ${selected}`}
          onClick={() => setQuestions(option)}
        >
          {option}
        </button>
      );
    });
  }

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        Questions Per Test
      </div>
      <div className={styles.buttons}>
        {buildButtons()}
      </div>
    </div>
  );
}

Questions.propTypes = {
  questionsOptions: PropTypes.arrayOf(PropTypes.number),
  questions: PropTypes.number,
  setQuestions: PropTypes.func.isRequired,
};

export default Questions;
