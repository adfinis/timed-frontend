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
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:ember-suave/recommended',
    'prettier'
  ],
  rules: {
    'valid-jsdoc': ['error', { requireReturn: false }],
    'require-jsdoc': 'error',
    'ember/avoid-leaking-state-in-components': 'off',
    'ember/named-functions-in-promises': 'off',
    'ember/alias-model-in-controller': 'off',
    'ember/use-ember-get-and-set': 'off',
    'ember/order-in-components': 'off',
    'ember/order-in-controllers': 'off',
    'ember/order-in-routes': 'off',
    'ember/no-old-shims': 'error',
    'prettier/prettier': ['error', { singleQuote: true, semi: false }]
  }
}
