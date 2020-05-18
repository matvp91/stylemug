import React, { useState } from 'react';
import stylemug from 'stylemug';
import { globalStyles } from './globals';

const styles = stylemug.create({
  title: {
    fontSize: '31px',
    fontFamily: 'courier',
    color: 'green',
  },
  titleRed: {
    color: 'red',
    '&:hover': 'aaa',
  },
});

const secondaryStyles = stylemug.create({
  color: {
    color: '#444',
  },
});

export default function App() {
  const [show, setShow] = useState(false);

  function onClick() {
    setShow(!show);
  }

  return (
    <div className={styles(globalStyles.container)}>
      <h1
        className={styles('title', secondaryStyles.color, show && 'titleRed')}
      >
        Hello World
      </h1>
      <button onClick={onClick}>Click</button>
    </div>
  );
}
