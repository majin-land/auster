const path = require('path')

module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalDecorators: true,
      experimentalObjectRestSpread: true,
      jsx: true,
      classes: true,
    },
    sourceType: 'module'
  },
  plugins: ['import'],
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    camelcase: 0,
    'arrow-body-style': 0,
    'arrow-parens': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'func-names': ['error', 'never'],
    'linebreak-style': ['error', 'unix'],
    'lines-between-class-members': 0,
    'max-len': 0,
    'no-console': 0,
    'no-nested-ternary': 1,
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-underscore-dangle': 0,
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],
    'object-curly-newline': [0],
    'object-curly-spacing': ['error', 'always'],
    'operator-linebreak': ['error', 'after'],
    'prefer-destructuring': ["error", {
      "array": false,
      "object": true
    }],

    // import
    'import/named': 2,
    'import/no-cycle': 1,
    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: [
          path.resolve(__dirname),
          path.resolve(__dirname, 'packages/site'),
          path.resolve(__dirname, 'packages/server'),
        ],
      },
    ],
    'import/prefer-default-export': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.android.js',
          '.ios.js',
        ],
      },
    },
  },
};
