module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  globals: {
    L: true,
    $: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'func-names': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'no-alert': 'off',
    'prefer-destructuring': 'off',
    'comma-dangle': 'off',
    'max-len': 'off',
    'linebreak-style': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
