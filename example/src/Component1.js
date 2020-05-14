import React from 'react';
import stylemug from 'stylemug';

const styles = stylemug.create({
  default: {
    color: 'var(--color)',
    backgroundColor: 'var(--bg-color)',
  },
});

export default function Component1() {
  return (
    <div className={styles('default')}>
      <h1>I am a site</h1>
      <p>foo bar</p>
    </div>
  );
}
