import React, { useReducer } from 'react';
import { useLocalStorage } from '../utilities/storage';
import Facts from './Facts';
import Game from './Game';
import GameControls from './GameControls';
import NumberPad from './NumberPad';
import PerMinute from './PerMinute';
import Questions from './Questions';
import styles from '../styles/App.module.css';

function initGame() {
  return {};
}

function gameReducer(state) {
  switch (state.type) {
    default:
      return state;
  }
}

function App() {
  const factsOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const questionsOptions = [20, 40, 60, 80, 100];
  const perMinuteOptions = [4, 8, 12, 16, 20, 24];
  const [game, dispatchGame] = useReducer(gameReducer, initGame());
  const [facts, setFacts] = useLocalStorage('TimesFacts', [2]);
  const [questions, setQuestions] = useLocalStorage('TimesQuestions', 80);
  const [perMinute, setPerMinute] = useLocalStorage('TimesPerMinute', 16);

  return (
    <div className={styles.page}>
      <div className={styles.leftColumn}>
        <Facts
          factsOptions={factsOptions}
          facts={facts}
          setFacts={setFacts}
        />
        <GameControls
        />
        <div className={styles.main}>
          <Game
            game={game}
          />
        </div>
      </div>
      <div className={styles.rightColumn}>
        <Questions
          questionsOptions={questionsOptions}
          questions={questions}
          setQuestions={setQuestions}
        />
        <PerMinute
          perMinuteOptions={perMinuteOptions}
          perMinute={perMinute}
          setPerMinute={setPerMinute}
        />
        <div className={styles.main}>
          <NumberPad
            input={(value) => dispatchGame({ type: 'input', value })}
            clear={() => dispatchGame({ type: 'input', value: '' })}
            submit={(value) => dispatchGame({ type: 'submit', value })}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
