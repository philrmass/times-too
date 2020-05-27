import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Game.module.css';

function Game({
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
    if (!isTest) {
      return <div></div>;
    }

    return (
      <div className={styles.questions}>
        {game.question + 1}/{game.questions}
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

  function buildStatus() {
    if (!game.isPractice) {
      return null;
    }

    let text = '';
    if (game.problems.length > 0) {
      const correct = game.problems.filter((problem) => problem.correct).length;
      text = `${correct} of ${game.problems.length} correct`;
    }

    return (
      <div className={styles.status}>
        <div>
          {text}
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
        {buildStatus()}
      </div>
      {buildMessage()}
    </div>
  );
}

Game.propTypes = {
  isTest: PropTypes.bool.isRequired,
  game: PropTypes.object.isRequired,
  showResults: PropTypes.func.isRequired,
};

export default Game;
