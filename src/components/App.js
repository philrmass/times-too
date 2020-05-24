//??? fix layout with version
//??? fix start, practice buttons
//??? make options buttons
//??? fix all start & stop states
//??? how to stop timer on quit
//??? add practice to game state
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
    question: 0,
    questions: 0,
    first: 0,
    second: 0,
    input: '',
    problems: [],
    remaining: 0,
    message: getInitMessage(),
  };
}

function getInitMessage() {
  return `Select the facts to test,
  the number of questions,
  and the questions per minute,
  and then press 'Start Test'

  Or press 'Practice'
  to just practice your facts

  Use the number keys on the right 
  to enter your answer`;
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'test': {
      const [first, second] = pickProblem(action.facts);
      return {
        ...initGame(),
        facts: action.facts,
        questions: action.questions,
        first,
        second,
        message: '',
      };
    }
    case 'input':
      return {
        ...state,
        input: `${state.input}${action.value}`,
      };
    case 'clear':
      return {
        ...state,
        input: '',
      };
    case 'submit': {
      const answer = parseInt(state.input);
      const correct = (answer === state.first * state.second);
      const problem = {
        first: state.first,
        second: state.second,
        answer,
        correct,
      };
      const problems = [...state.problems, problem];

      const question = state.question + 1;
      if (question >= state.questions) {
        const message = 'You are done'; //??? results message
        return {
          ...state,
          question,
          problems,
          message,
        };
      }

      const [first, second] = pickProblem(state.facts);
      return {
        ...state,
        question,
        first,
        second,
        input: '',
        problems,
      };
    }
    case 'setTime':
      if (action.remaining <= 0) {
        console.log(' DONE');
        return {
          ...state,
          message: 'Time is up', //??? results message
        };
      }

      return {
        ...state,
        remaining: action.remaining,
      };
    case 'stop':
      return {
        ...state,
        remaining: 0,
        message: 'You quit', //??? quit, results message
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
  return values[index];
}

function App() {
  const version = '0.1';
  const factsOptions = allFacts();
  const questionsOptions = [10, 20, 40, 80];
  const perMinuteOptions = [4, 8, 12, 16, 20, 24];
  const [game, dispatch] = useReducer(gameReducer, initGame());
  const [facts, setFacts] = useLocalStorage('TimesFacts', [2, 3, 4]);
  const [questions, setQuestions] = useLocalStorage('TimesQuestions', 10);
  const [perMinute, setPerMinute] = useLocalStorage('TimesPerMinute', 16);
  const isPractice = false;
  const isTest = game.remaining > 0;
  console.log('IT', isTest);

  function startTimer() {
    const msPerS = 1000;
    const msPerMin = 60 * msPerS;
    const length = msPerMin * (questions / perMinute);
    const end = Date.now() + length;
    const remaining = Math.ceil(length / msPerS);

    const updateTime = () => {
      const remainingMs = end - Date.now();
      const remaining = Math.ceil(remainingMs / msPerS);

      //??? check game is still playing
      dispatch({ type: 'setTime', remaining });
      if (remaining > 0) {
        setTimeout(updateTime, 1000);
      }
    };

    dispatch({ type: 'setTime', remaining });
    setTimeout(updateTime, 1000);
  }

  function startTest() {
    dispatch({ type: 'test', facts, questions });
    startTimer();
  }

  function stop() {
    //??? stop timer if test
    dispatch({ type: 'stop' });
  }

  return (
    <div className={styles.page}>
      <div className={styles.leftColumn}>
        <Facts
          factsOptions={factsOptions}
          facts={facts}
          setFacts={setFacts}
        />
        <GameControls
          isPractice={isPractice}
          isTest={isTest}
          startTest={startTest}
          stop={stop}
        />
        <div className={styles.main}>
          <Game
            isPractice={isPractice}
            isTest={isTest}
            game={game}
            version={version}
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
            clear={() => dispatch({ type: 'clear' })}
            submit={() => dispatch({ type: 'submit' })}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
