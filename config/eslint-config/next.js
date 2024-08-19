/** @type {import('eslint').Linter.Config} */

module.exports = {
  extends: ['@rocketseat/eslint-config/next', 'plugin:react/recommended'],
  plugins: ['simple-import-sort'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/prop-types': [
      2,
      {
        ignore: [
          'className',
          'orientation',
          'decorative',
          'sideOffset',
          'checked',
          'position',
          'align',
        ],
      },
    ], // needed because of shadcn ui empty className
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
