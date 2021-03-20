module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: '@lacussoft',
  ignorePatterns: [],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  rules: {
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'no-console': 'off',
  },
}
