const path = require('path')

module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true,
  },
  extends: [
    'plugin:react/recommended',
  ],
  globals: {
    ga: true,
    window: true,
    document: true,
    navigator: true,
    graphql: false,
    __VERSION__: true,
    __ENV__: true,
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    // react
    'react/destructuring-assignment': 0,
    'react/forbid-prop-types': [2, { forbid: ['any'] }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-fragments': [1],
    'react/jsx-key': 1,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/no-array-index-key': 1, // warning for now, don't know how to fix
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'react/prefer-stateless-function': 0,
    'react/sort-comp': 0,
    // jsx-a11y
    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['Link'],
      specialLink: ['to'],
      aspects: ['noHref', 'invalidHref', 'preferButton'],
    }],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
  },
  settings: {
    'import/resolver': {
      alias: [
        ['~', path.resolve(__dirname)],
      ],
    },
  },
}
