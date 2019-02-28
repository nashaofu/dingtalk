module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    angular: 'readonly'
  },
  env: {
    node: true,
    browser: true
  },
  extends: ['standard', 'plugin:vue/essential'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
