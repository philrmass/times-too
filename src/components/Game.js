import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Game.module.css';

function Game({
  game,
}) {
  return (
    <div className={styles.main}>
      Game
      <div>
        {JSON.stringify(game, null, 2)}
      </div>
    </div>
  );
}

Game.propTypes = {
  game: PropTypes.object.isRequired,
};

export default Game;
