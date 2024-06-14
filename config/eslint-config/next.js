/** @type {import('eslint').Linter.Config} */

module.exports = {
  extends: ['@rocketseat/eslint-config/next', 'plugin:react/recommended'],
  plugins: ['simple-import-sort'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'simple-import-sort/imports': 'error',
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
      },
    ],
  },
}
