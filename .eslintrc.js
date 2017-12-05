module.exports = {
  globals: {
    server: true
  },
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  globals: {
    server: true,
    Reflect: true
  },
  env: {
    browser: true
  },
  plugins: ['ember', 'prettier'],
  extends: ['eslint:recommended', 'plugin:ember/recommended', 'prettier'],
  rules: {
    'prettier/prettier': 'error'
  }
}
