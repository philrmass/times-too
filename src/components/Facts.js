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

      return (
        <button
          className={`${styles.button} ${selected}`}
          key={option}
        >
          {/*setFacts*/}
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
