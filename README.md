# stylemug

This is an experimental library, not yet ready to be used in production. Heavily inspired by Facebook's internal `stylex` and the [Building the new Facebook](https://developers.facebook.com/videos/2019/building-the-new-facebookcom-with-react-graphql-and-relay/) presentation, at ~28:00.

## Getting started

Use `stylemug.create` to write your style rules. It will return a resolver function in order to select your class names.

```javascript
import React from 'react';
import stylemug from 'stylemug';

const styles = stylemug.create({
  default: {
    backgroundColor: 'red',
    color: 'black',
  },
  large: {
    fontSize: '32px',
  },
});

function App() {
  const [large, toggleLarge] = useToggle(true);

  return (
    <div className={styles('default', large && 'large')}>
      <button onClick={toggleLarge}>Toggle me</button>
    </div>
  );
}
```

Include the compiler in your `webpack.config.js` config file.

```javascript
const stylemugCompiler = require('stylemug/compiler');

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            // The babel plugin will collect each schematic from `stylemug.create` and rewrite the schema to a lookup table.
            plugins: [stylemugCompiler.babel],
          },
        },
      },
    ],
  },
  plugins: [
    new stylemugCompiler.webpack({
      // Each atomic rule will be written to the bundle.
      name: 'bundle.css',
    }),
  ],
};
```
