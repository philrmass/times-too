import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/NumberPad.module.css';

function NumberPad({
  input,
  clear,
  submit,
}) {
  function ignoreEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  function buildNumberButtons() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    return numbers.map((number) => (
      <button
        key={number}
        className={styles.button}
        onClick={() => input(`${number}`)}
        onKeyUp={ignoreEnter}
        onKeyPress={ignoreEnter}
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
        onKeyUp={ignoreEnter}
        onKeyPress={ignoreEnter}
      >
        Clear
      </button>
      <button
        className={`${styles.button} ${styles.ok}`}
        onClick={submit}
        onKeyUp={ignoreEnter}
        onKeyPress={ignoreEnter}
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
