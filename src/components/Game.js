import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Game.module.css';

function Game({
  isPractice,
  isTest,
  game,
  showResults,
}) {
  function buildTime() {
    if (!isTest) {
      return <div></div>;
    }

    const mins = Math.floor(game.remaining / 60);
    const secs = game.remaining - (60 * mins);
    const secsStr = `0${secs}`.slice(-2);

    return (
      <div className={styles.time}>
        {`${mins}:${secsStr}`}
      </div>
    );
  }

  function buildQuestions() {
    let text = '';
    if (isPractice && game.problems.length > 0) {
      const correct = game.problems.filter((problem) => problem.correct).length;
      const total = game.problems.length;
      text = `${correct}/${total} correct`;
    } else if (isTest) {
      text = `${game.question + 1}/${game.questions}`;
    }

    return (
      <div className={styles.questions}>
        {text}
      </div>
    );
  }

  function buildProblem() {
    let style = '';
    let first = game.first;
    let second = game.second;
    let input = game.input;

    if (game.isPractice && game.problem) {
      style = game.problem.correct ? styles.correct : styles.incorrect;
      first = game.problem.first;
      second = game.problem.second;
      input = `${game.problem.answer}`;
    }

    return (
      <div className={`${styles.problem} ${style}`}>
        <div>{first}</div>
        <div>{`x ${second}`}</div>
        <div className={styles.line}></div>
        <div className={styles.answer}>
          {input || ' '}
        </div>
      </div>
    );
  }

  function buildMessage() {
    if (!game.message) {
      return null;
    }

    return (
      <div className={styles.message}>
        {game.message}
        {buildResultsLink()}
      </div>
    );
  }

  function buildResultsLink() {
    if (game.problems.length < 1) {
      return null;
    }

    return (
      <div>
        <button
          className={styles.link}
          onClick={showResults}
        >
          Show your results
        </button>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.game}>
        {buildTime()}
        {buildProblem()}
        {buildQuestions()}
      </div>
      {buildMessage()}
    </div>
  );
}

Game.propTypes = {
  isPractice: PropTypes.bool.isRequired,
  isTest: PropTypes.bool.isRequired,
  game: PropTypes.object.isRequired,
  showResults: PropTypes.func.isRequired,
};

export default Game;
