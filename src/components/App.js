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
    timeMs: 0,
    problems: [],
    problem: null,
    time: 0,
    active: false,
    isPractice: false,
    message: getInitMessage(),
  };
}

function getInitMessage() {
  return `Select the facts to test,
  the number of questions,
  and the questions per minute
  in the Options above,
  and then press 'Start Test'

  Or press 'Practice'
  to just practice your facts

  Use the number keys and OK
  to enter your answer
  `;
}

function getResultsMessage(intro, state) {
  const total = state.problems.length;
  const right = state.problems.filter((problem) => problem.correct).length;
  const wrong = total - right;
  const time = state.problems.reduce((sum, p) => sum + p.duration, 0) || 1;
  const elapsed = Math.round(time / 1000, 0);
  const mins = Math.floor(elapsed / 60);
  const minText = mins > 0 ? `${mins} minutes, ` : '';
  const timed = state.problems.filter((problem) => problem.duration > 0).length;
  const secs = elapsed - (60 * mins);
  const elapsedMin = time / 60000;
  const perMinute = (timed / elapsedMin).toFixed(0);

  return `${intro}

  Out of ${total} questions,
  you got ${right} right
  and ${wrong} wrong

  in ${minText}${secs} seconds
  at ${perMinute} questions per minute
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
        timeMs: Date.now(),
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
        timeMs: Date.now(),
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
      const value = parseInt(state.input);
      const answer = isNaN(value) ? undefined : value;
      const correct = (answer === state.first * state.second);
      const now = Date.now();
      const duration = now - state.timeMs;
      const problem = {
        first: state.first,
        second: state.second,
        answer,
        correct,
        duration,
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
        timeMs: now,
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
      if (state.active && !state.isPractice && action.seconds <= 0) {
        const remaining = pickProblems(state.questions - state.problems.length, state.facts);
        const problems = [...state.problems, ...remaining];

        return {
          ...state,
          time: 0,
          problems,
          active: false,
          message: getResultsMessage('Time is up', { ...state, problems }),
        };
      }

      return {
        ...state,
        time: action.seconds,
      };
    case 'stop': {
      const type = state.isPractice ? 'Practice' : 'Test';

      return {
        ...state,
        time: 0,
        active: false,
        message: getResultsMessage(`${type} stopped`, state),
      };
    }
    default:
      return state;
  }
}

function pickProblems(count, facts) {
  let problems = [];

  for (let i = 0; i < count; i++) {
    const [first, second] = pickProblem(facts);

    problems.push({
      first,
      second,
      answer: undefined,
      correct: false,
      duration: 0,
    });
  }

  return problems;
}

function pickProblem(facts) {
  const fact = pick(facts);
  const max = Math.max(9, fact);
  const others = [...range(2, max)];
  const other = pick(others);
  const order = pick([true, false]);

  return order ? [fact, other] : [other, fact];
}

function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

function pick(values) {
  const index = Math.floor(values.length * Math.random());
  return values[index];
}

function App() {
  const version = '0.5.1';
  const factsOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const questionsOptions = [10, 20, 40, 80];
  const perMinuteOptions = [4, 8, 12, 16, 20, 24];
  const [game, dispatch] = useReducer(gameReducer, initGame());
  const [, setTimer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [facts, setFacts] = useLocalStorage('TimesFacts', [2, 3, 4, 5, 6, 7, 8, 9]);
  const [questions, setQuestions] = useLocalStorage('TimesQuestions', 80);
  const [perMinute, setPerMinute] = useLocalStorage('TimesPerMinute', 16);
  const isPractice = game.active && game.isPractice;
  const isTest = game.active && !game.isPractice;

  function countDown() {
    const msPerS = 1000;
    const msPerMin = 60 * msPerS;
    const length = msPerMin * (questions / perMinute);
    const end = Date.now() + length;

    function updateTime() {
      const remainingMs = end - Date.now();
      const seconds = Math.ceil(remainingMs / msPerS);

      dispatch({ type: 'setTime', seconds });
      if (seconds > 0) {
        setTimer((timer) => {
          clearTimeout(timer);
          return setTimeout(updateTime, 1000);
        });
      }
    }

    updateTime();
  }

  function countUp() {
    const msPerS = 1000;
    const start = Date.now() - 1;

    function updateTime() {
      const elapsedMs = Date.now() - start;
      const seconds = Math.ceil(elapsedMs / msPerS);

      dispatch({ type: 'setTime', seconds });
      setTimer((timer) => {
        clearTimeout(timer);
        return setTimeout(updateTime, 1000);
      });
    }

    updateTime();
  }

  function startTest() {
    dispatch({ type: 'startTest', facts, questions });
    countDown();
  }

  function startPractice() {
    dispatch({ type: 'startPractice', facts, questions });
    countUp();
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
      const displayTime = 500;
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
    const time = problem.duration / 1000;
    const timeText = time > 0 ? `${time.toFixed(1)}s` : '';

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
        <div className={styles.time}>
          {timeText}
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
          active={game.active}
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
