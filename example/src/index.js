import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import stylemug from 'stylemug';
import Component1 from './Component1';
import globals from './globals';

const styles = stylemug.create({
  default: {
    '--color': 'black',
    '--bg-color': 'white',
  },
  dark: {
    '--color': 'white',
    '--bg-color': 'black',
  },
});

function App() {
  const [dark, setDark] = useState(false);

  function onClick() {
    setDark(!dark);
  }

  return (
    <div
      className={styles(
        'nonexist',
        'default',
        dark && 'dark',
        globals.container
      )}
    >
      <button onClick={onClick}>Dark mode: {dark ? 'off' : 'on'}</button>
      <Component1 />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
