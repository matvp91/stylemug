import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import stylemug from 'stylemug';

const styles = stylemug.create({
  root: {
    color: 'yellow',
  },
});

function App() {
  return <div className={styles('root')}>Hello</div>;
}

ReactDOM.render(<App />, document.getElementById('root'));
