import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Facts.module.css';

function Facts({
  factsOptions,
  facts,
  setFacts,
}) {
  function buildButtons() {
    return factsOptions.map((option) => {
      const selected = facts.includes(option) ? styles.selected : '';

      function toggleFact(fact) {
        if (facts.includes(fact)) {
          setFacts(facts.filter((value) => value !== fact));
        } else {
          setFacts([...facts, fact]);
        }
      }

      return (
        <button
          key={option}
          className={`${styles.button} ${selected}`}
          onClick={() => toggleFact(option)}
        >
          {`${option}s`}
        </button>
      );
    });
  }

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        Multiplication Facts
      </div>
      <div className={styles.buttons}>
        {buildButtons()}
      </div>
    </div>
  );
}

Facts.propTypes = {
  factsOptions: PropTypes.arrayOf(PropTypes.number),
  facts: PropTypes.arrayOf(PropTypes.number),
  setFacts: PropTypes.func.isRequired,
};

export default Facts;
