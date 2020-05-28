import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Options.module.css';

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
          className={styles.link}
          onClick={() => setShow((s) => !s)}
        >
          Options
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
