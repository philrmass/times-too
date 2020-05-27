//??? fix logo
//??? fix options
//??? dont repeat the exact problem
//??? improve alignment of timer
//??? ask more of the hard ones
//??? include 10+ if the fact is > 9
//??? analyze tests for hard-problem frequency
import React, { useReducer, useState } from 'react';
import { useLocalStorage } from '../utilities/storage';
import Game from './Game';
import GameControls from './GameControls';
import NumberPad from './NumberPad';
import Options from './Options';
import styles from '../styles/App.module.css';

function initGame() {
  return {
    facts: [],
    question: 0,
    questions: 0,
    first: 0,
    second: 0,
    input: '',
    problems: [],
    problem: null,
    remaining: 0,
    active: false,
    isPractice: false,
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
  to enter your answer
  `;
}

function getResultsMessage(intro, state) {
  const correct = state.problems.filter((problem) => problem.correct).length;
  const total = state.isPractice ? state.problems.length : state.questions;

  return `${intro}

  You got ${correct} of ${total} questions correct
  `;
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'startTest': {
      const [first, second] = pickProblem(action.facts);
      return {
        ...initGame(),
        facts: action.facts,
        questions: action.questions,
        first,
        second,
        active: true,
        message: '',
      };
    }
    case 'startPractice': {
      const [first, second] = pickProblem(action.facts);
      return {
        ...initGame(),
        facts: action.facts,
        questions: action.questions,
        first,
        second,
        active: true,
        isPractice: true,
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
      if (!state.isPractice && question >= state.questions) {
        return {
          ...state,
          question,
          problems,
          active: false,
          message: getResultsMessage('Test complete', { ...state, problems }),
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
        problem: state.isPractice ? problem : null,
      };
    }
    case 'next':
      return {
        ...state,
        problem: null,
      };
    case 'setTime':
      if (state.active && !state.isPractice && action.remaining <= 0) {
        return {
          ...state,
          remaining: 0,
          active: false,
          message: getResultsMessage('Time is up', state),
        };
      }

      return {
        ...state,
        remaining: action.remaining,
      };
    case 'stop': {
      const type = state.isPractice ? 'Practice' : 'Test';

      return {
        ...state,
        remaining: 0,
        active: false,
        message: getResultsMessage(`${type} stopped`, state),
      };
    }
    default:
      return state;
  }
}

function pickProblem(facts) {
  const others = [2, 3, 4, 5, 6, 7, 8, 9];
  const fact = pick(facts);
  const other = pick(others);
  const order = pick([true, false]);

  return order ? [fact, other] : [other, fact];
}

function pick(values) {
  const index = Math.floor(values.length * Math.random());
  return values[index];
}

function App() {
  const version = '0.4.2';
  const factsOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const questionsOptions = [10, 20, 40, 80];
  const perMinuteOptions = [4, 8, 12, 16, 20, 24];
  const [game, dispatch] = useReducer(gameReducer, initGame());
  const [, setTimer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [facts, setFacts] = useLocalStorage('TimesFacts', [2, 3, 4]);
  const [questions, setQuestions] = useLocalStorage('TimesQuestions', 10);
  const [perMinute, setPerMinute] = useLocalStorage('TimesPerMinute', 24);
  const isPractice = game.active && game.isPractice;
  const isTest = game.active && !game.isPractice;

  function startTimer() {
    const msPerS = 1000;
    const msPerMin = 60 * msPerS;
    const length = msPerMin * (questions / perMinute);
    const end = Date.now() + length;
    //const remaining = Math.ceil(length / msPerS);

    function updateTime() {
      const remainingMs = end - Date.now();
      const remaining = Math.ceil(remainingMs / msPerS);

      dispatch({ type: 'setTime', remaining });
      if (remaining > 0) {
        setTimer((timer) => {
          clearTimeout(timer);
          return setTimeout(updateTime, 1000);
        });
      }
    }

    updateTime();
  }

  function startTest() {
    dispatch({ type: 'startTest', facts, questions });
    startTimer();
  }

  function startPractice() {
    dispatch({ type: 'startPractice', facts, questions });
  }

  function stop() {
    setTimer((timer) => {
      clearTimeout(timer);
      return null;
    });
    dispatch({ type: 'stop' });
  }

  function submit() {
    if (isPractice) {
      const displayTime = 1500;
      setTimeout(() => dispatch({ type: 'next' }), displayTime);
    }
    dispatch({ type: 'submit' });
  }

  function buildResults() {
    if (!showResults) {
      return null;
    }

    return (
      <div className={styles.resultsPage}>
        <div className={styles.results}>
          {buildCloseLink()}
          <div className={styles.problems}>
            {game.problems.map((problem, index) => (
              buildProblem(problem, index)
            ))}
          </div>
        </div>
      </div>
    );
  }

  function buildProblem(problem, index) {
    const style = problem.correct ? '' : styles.incorrect;

    return (
      <div
        key={index}
        className={`${styles.problem} ${style}`}
        onClick={() => setShowResults(false)}
      >
        <div>{problem.first}</div>
        <div>{`x ${problem.second}`}</div>
        <div className={styles.line}></div>
        <div className={styles.answer}>
          {problem.answer}
        </div>
      </div>
    );
  }

  function buildCloseLink() {
    return (
      <button
        className={styles.link}
        onClick={() => setShowResults(false)}
      >
        Close
      </button>
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
    <div className={styles.page}>
      <div className={styles.header}>
        <Options
          factsOptions={factsOptions}
          questionsOptions={questionsOptions}
          perMinuteOptions={perMinuteOptions}
          facts={facts}
          questions={questions}
          perMinute={perMinute}
          setFacts={setFacts}
          setQuestions={setQuestions}
          setPerMinute={setPerMinute}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.first}>
          <Game
            isPractice={isPractice}
            isTest={isTest}
            game={game}
            showResults={() => setShowResults(true)}
          />
        </div>
        <div className={styles.second}>
          <GameControls
            isPractice={isPractice}
            isTest={isTest}
            startPractice={startPractice}
            startTest={startTest}
            stop={stop}
          />
          <NumberPad
            input={(value) => dispatch({ type: 'input', value })}
            clear={() => dispatch({ type: 'clear' })}
            submit={submit}
          />
        </div>
      </div>
      <div className={styles.footer}>
        {buildVersion()}
      </div>
      {buildResults()}
    </div>
  );
}

export default App;
