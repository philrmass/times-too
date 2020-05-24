import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Game.module.css';

function Game({
  game,
}) {
  function buildTime() {
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
    return (
      <div className={styles.questions}>
        {game.question + 1}/{game.questions}
      </div>
    );
  }

  function buildProblem() {
    return (
      <div className={styles.problem}>
        {`${game.first}\nx${game.second}\n---\n${game.input}`}
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
      <div className={styles.message}>
        {buildMessage()}
      </div>
    </div>
  );
}

Game.propTypes = {
  game: PropTypes.object.isRequired,
};

export default Game;
