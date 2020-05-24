import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Questions.module.css';

function Questions({
  questionsOptions,
  questions,
  setQuestions,
}) {
  return (
    <div className={styles.main}>Questions
      <div>{JSON.stringify(questionsOptions)}</div>
      <div>{JSON.stringify(questions)}</div>
      <div>{typeof setQuestions}</div>
    </div>
  );
}

Questions.propTypes = {
  questionsOptions: PropTypes.arrayOf(PropTypes.number),
  questions: PropTypes.number,
  setQuestions: PropTypes.func.isRequired,
};

export default Questions;
