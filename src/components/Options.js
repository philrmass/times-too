import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Options.module.css';

function Options({
  active,
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

  function toggleFact(fact) {
    if (facts.includes(fact)) {
      if (facts.length > 1) {
        setFacts(facts.filter((value) => value !== fact));
      }
    } else {
      setFacts([...facts, fact]);
    }
  }

  function buildOptionsSummary() {
    const sorted = facts.sort((a, b) => a - b);
    const fText = sorted.map((f) => `${f}s, `).join('');
    const qText = `${questions} questions, `;
    const pText = `${perMinute} per minute`;
    return (
      <div className={styles.summary}>
        {`${fText}\n${qText}${pText}`}
      </div>
    );
  }

  function buildOptions() {
    if (!show) {
      return null;
    }

    return (
      <div className={styles.options}>
        {buildOption(
          'Multiplication Facts',
          facts,
          factsOptions,
          toggleFact,
          's',
        )}
        {buildOption(
          'Questions Per Test',
          [questions],
          questionsOptions,
          setQuestions,
        )}
        {buildOption(
          'Questions Per Minute',
          [perMinute],
          perMinuteOptions,
          setPerMinute,
        )}
      </div>
    );
  }

  function buildOption(name, values, options, update, suffix) {
    return (
      <div>
        <div className={styles.title}>
          {name}
        </div>
        <div className={styles.buttons}>
          {buildButtons(values, options, update, suffix)}
        </div>
      </div>
    );
  }

  function buildButtons(values, options, update, suffix = '') {
    return options.map((option) => {
      const selected = values.includes(option) ? styles.selected : '';

      return (
        <button
          key={option}
          className={`${styles.button} ${selected}`}
          onClick={() => update(option)}
        >
          {`${option}${suffix}`}
        </button>
      );
    });
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <button
          disabled={active}
          className={styles.link}
          onClick={() => setShow((s) => !s)}
        >
          {show ? 'Close' : 'Options'}
        </button>
        {buildOptionsSummary()}
      </div>
      <div className={styles.belowHeader}>
        {buildOptions()}
      </div>
    </div>
  );
}

Options.propTypes = {
  active: PropTypes.bool.isRequired,
  factsOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  questionsOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  perMinuteOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  facts: PropTypes.arrayOf(PropTypes.number).isRequired,
  questions: PropTypes.number.isRequired,
  perMinute: PropTypes.number.isRequired,
  setFacts: PropTypes.func.isRequired,
  setQuestions: PropTypes.func.isRequired,
  setPerMinute: PropTypes.func.isRequired,
};

export default Options;
