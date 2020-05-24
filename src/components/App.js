import React, { useReducer, useState } from 'react';
import { useLocalStorage } from '../utilities/storage';
import Facts from './Facts';
import Game from './Game';
import GameControls from './GameControls';
import NumberPad from './NumberPad';
import PerMinute from './PerMinute';
import Questions from './Questions';
import styles from '../styles/App.module.css';

function allFacts() {
  return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
}

function initGame() {
  return {
    facts: [],
    questions: 0,
    question: 0,
    input: '',
    first: 0,
    second: 0,
    remaining: 0,
    message: 'Select the options above and then press Start to begin',
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'start':
      console.log('START');
      const [first, second] = pickProblem(action.facts);
      return {
        ...initGame(),
        facts: action.facts,
        questions: action.questions,
        first,
        second,
        message: '',
      };
    case 'input':
      console.log('INPUT', action);
      return state;
    case 'clear':
      console.log('CLEAR', action);
      return state;
    case 'submit':
      console.log('SUBMIT', action);
      return state;
    case 'setTime':
      console.log('SET-TIME', action.remaining);
      return {
        ...state,
        remaining: action.remaining,
      };
    case 'quit':
      console.log('QUIT');
      return {
        ...state,
        remaining: 0,
        message: 'You quit', //??? add custom message
      };
    default:
      return state;
  }
}

function pickProblem(facts) {
  const all = allFacts();
  const fact = pick(facts);
  const other = pick(all);
  const order = pick([true, false]);

  return order ? [fact, other] : [other, fact];
}

function pick(values) {
  const index = Math.floor(values.length * Math.random());
  console.log(`  PICK ${values[index]} from [${values}]`);
  return values[index];
}

function App() {
  const factsOptions = allFacts();
  const questionsOptions = [20, 40, 60, 80, 100];
  const perMinuteOptions = [4, 8, 12, 16, 20, 24];
  const [game, dispatch] = useReducer(gameReducer, initGame());
  const [endTime, setEndTime] = useState(0);
  const [facts, setFacts] = useLocalStorage('TimesFacts', [2, 3, 4]);
  const [questions, setQuestions] = useLocalStorage('TimesQuestions', 80);
  const [perMinute, setPerMinute] = useLocalStorage('TimesPerMinute', 16);

  function startTimer() {
    const msPerS = 1000;
    const msPerMin = 60 * msPerS;
    const length = msPerMin * (questions / perMinute);
    const now = Date.now();
    const end = now + length;

    setEndTime(end);
    dispatch({ type: 'setTime', remaining: Math.ceil(length / msPerS) });
  }

  function start() {
    dispatch({ type: 'start', facts, questions });
    startTimer();
  }

  function quit() {
    //??? stop timer
    dispatch({ type: 'quit' });
  }

  console.log('  time', endTime && Math.round((endTime - Date.now()) / 1000));
  return (
    <div className={styles.page}>
      <div className={styles.leftColumn}>
        <Facts
          factsOptions={factsOptions}
          facts={facts}
          setFacts={setFacts}
        />
        <GameControls
          isPlaying={game.remaining > 0}
          start={start}
          quit={quit}
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
            input={(value) => dispatch({ type: 'input', value })}
            clear={() => dispatch({ type: 'input', value: '' })}
            submit={(value) => dispatch({ type: 'submit', value })}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
