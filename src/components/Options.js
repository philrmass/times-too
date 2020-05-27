import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Options.module.css';
import Facts from './Facts';
import PerMinute from './PerMinute';
import Questions from './Questions';

function Options({
  factsOptions,
  questionsOptions,
  perMinuteOptions,
  facts,
  questions,
  perMinute,
  setFacts,
  setQuestions,
  setPerMinute,
}) {
  const [show, setShow] = useState(false);

  function buildOptions() {
    if (!show) {
      return null;
    }

    return (
      <div className={styles.options}>
        <div className={styles.option}>
          <Facts
            factsOptions={factsOptions}
            facts={facts}
            setFacts={setFacts}
          />
        </div>
        <div className={styles.option}>
          <Questions
            questionsOptions={questionsOptions}
            questions={questions}
            setQuestions={setQuestions}
          />
        </div>
        <div className={styles.option}>
          <PerMinute
            perMinuteOptions={perMinuteOptions}
            perMinute={perMinute}
            setPerMinute={setPerMinute}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <button
          className={styles.link}
          onClick={() => setShow((s) => !s)}
        >
          Options
        </button>
      </div>
      <div className={styles.bottom}>
        {buildOptions()}
      </div>
    </div>
  );
}

Options.propTypes = {
  factsOptions: PropTypes.arrayOf(PropTypes.number),
  questionsOptions: PropTypes.arrayOf(PropTypes.number),
  perMinuteOptions: PropTypes.arrayOf(PropTypes.number),
  facts: PropTypes.arrayOf(PropTypes.number),
  questions: PropTypes.number,
  perMinute: PropTypes.number,
  setFacts: PropTypes.func.isRequired,
  setQuestions: PropTypes.func.isRequired,
  setPerMinute: PropTypes.func.isRequired,
};

export default Options;
