# stylemug ⚛️

A fast css-in-js library that extracts atomic CSS rules to a .css file.

- [Getting started](#getting-started)
- [Features](#features)
- [How it works](#how-it-works)

We try to limit the functionality of this package in order to do the following key features really well:

- It generates **Atomic CSS** from the static stylesheets defined in your component.
- The compiled rules are **extracted to a .css file**.
- The stylesheet code in your bundle is replaced (**no CSS in your JS**) with a hash map for classnames lookup at runtime.

Heavily inspired by Facebook's internal `stylex` and the "[Building the new Facebook](https://developers.facebook.com/videos/2019/building-the-new-facebookcom-with-react-graphql-and-relay/)" presentation, at ~28:00.

## Getting started

Add the package as a dependency.

```
npm i stylemug
```

The example below uses `stylemug.create` to define your stylesheet and will provide a `styles` function used to resolve your class names.

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

Add `stylemug/compiler`'s babel and webpack plugin in your `webpack.config.js` config file.

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
            // The babel plugin will collect each schematic from `stylemug.create`
            // and rewrite the schema to a lookup table.
            plugins: [stylemugCompiler.babel],
          },
        },
      },
    ],
  },
  plugins: [
    new stylemugCompiler.webpack({
      // The CSS rules extracted by babel will be written to
      // this file.
      name: 'bundle.css',
    }),
  ],
};
```

## Features

### Generic rules

A style rule can be shared from one file to another, aslong as the stylesheet itself remains static.

```javascript
// foo.js
export default stylemug.create({
  container: {
    width: '720px',
  },
});

// bar.js
import foo from './foo';

const styles = stylemug.create({
  default: {
    color: 'green',
  },
});

const classNames = styles('default', foo.container);
```

### Pseudo classes & media queries

```javascript
const styles = stylemug.create({
  button: {
    ...

    // pseudo classes
    '&:hover': {
      color: 'green',
    },

    // media queries
    '@media (min-width: 720px': {
      width: '100px',
    },
  },
});
```

## How it works

When `webpack` bundles your code, `babel-loader` is used to parse your JS files through Babel and perform a variety of transformations (one of the most common ones is converting ES6 to ES5). One of these transformations is part of the Babel plugin in `stylemug/compiler`.

The plugin looks for the import statement:

```javascript
import stylemug from 'stylemug';
```

and searches for occurances of `stylemug.create`.

```javascript
const styles = stylemug.create({
  className1: {
    color: 'red',
    backgroundColor: 'blue',
  },
  className2: {
    color: 'yellow';
  },
});
```

Afterwards, it compiles the stylesheet by generating a classname for each rule. This concept is called atomic CSS, offering single-purpose units of style, but applied via classes.

```css
.c8938 { color: 'red'; }
.e79cd { color: 'blue'; }
.aaddb { color: 'yellow'; }
```

Finally, the stylesheet is replaced with a hash map in your code. At this point, the stylesheet is gone from your JS bundle.

```javascript
const styles = stylemug.create({
  className1: {
    color: 'c8938',
    backgroundColor: 'e79cd',
  },
  className2: {
    color: 'aaddb',
  },
});
```

Internally, the `styles` function uses `Object.assign` to avoid duplication of rules.

```javascript
// 1.
const classes = styles('className1', 'className2');

// 2.
const classes = Object.assign(
  {},
  {
    color: 'c8938',
    backgroundColor: 'e79cd',
  },
  {
    color: 'aaddb',
  }
);

// 3.
const classes = ['e79cd', 'aaddb'];
```
