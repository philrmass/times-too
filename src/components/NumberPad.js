import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/NumberPad.module.css';

function NumberPad({
  input,
  clear,
  submit,
}) {
  function buildNumberButtons() {
    const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

    return numbers.map((number) => (
      <button
        key={number}
        className={styles.button}
        onClick={() => input(`${number}`)}
      >
        {number}
      </button>
    ));
  }

  return (
    <div className={styles.main}>
      {buildNumberButtons()}
      <button
        className={`${styles.button} ${styles.clear}`}
        onClick={clear}
      >
        Clear
      </button>
      <button
        className={`${styles.button} ${styles.ok}`}
        onClick={submit}
      >
        OK
      </button>
    </div>
  );
}

NumberPad.propTypes = {
  input: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};

export default NumberPad;
