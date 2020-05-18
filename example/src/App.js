import React, { useState } from 'react';
import stylemug from 'stylemug';
import { globalStyles } from './globals';

const styles = stylemug.create({
  title: {
    fontSize: '31px',
    fontFamily: 'courier',
    color: '#444',
  },
  titleRed: {
    color: 'red',
  },
});

export default function App() {
  const [show, setShow] = useState(false);

  function onClick() {
    setShow(!show);
  }

  return (
    <div className={globalStyles('container')}>
      <h1 className={styles('title', show && 'titleRed')}>Hello World</h1>
      <button onClick={onClick}>Click</button>
    </div>
  );
}
