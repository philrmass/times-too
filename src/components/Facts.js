import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Facts.module.css';

function Facts({
  factsOptions,
  facts,
  setFacts,
}) {
  return (
    <div className={styles.main}>Facts
      <div>{JSON.stringify(factsOptions)}</div>
      <div>{JSON.stringify(facts)}</div>
      <div>{typeof setFacts}</div>
    </div>
  );
}

Facts.propTypes = {
  factsOptions: PropTypes.arrayOf(PropTypes.number),
  facts: PropTypes.arrayOf(PropTypes.number),
  setFacts: PropTypes.func.isRequired,
};

export default Facts;
