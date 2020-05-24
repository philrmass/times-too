import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Game.module.css';

function Game({
  isTest,
  game,
  version,
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
    return (
      <div className={styles.problem}>
        <div>{game.first}</div>
        <div>{`x ${game.second}`}</div>
        <div className={styles.line}></div>
        <div className={styles.answer}>
          {game.input || ' '}
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
      </div>
    );
  }

  function buildVersion() {
    return (
      <div className={styles.version}>
        version {version}
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.game}>
        {buildTime()}
        {buildProblem()}
        {buildQuestions()}
        {buildVersion()}
      </div>
      {buildMessage()}
    </div>
  );
}

Game.propTypes = {
  isTest: PropTypes.bool.isRequired,
  game: PropTypes.object.isRequired,
  version: PropTypes.string.isRequired,
};

export default Game;
