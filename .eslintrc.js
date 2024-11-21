// eslint-disable-next-line no-undef
module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
    "plugin:react/recommended",
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'eslint-plugin-import',
    'eslint-plugin-react',
    'prettier',
  ],
  rules: {
    'linebreak-style': ['error', 'unix'],
    'no-empty': 0,
    'no-empty-function': 'off',
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-empty-pattern': 'off',
    'no-case-declarations': 'off',
    'prettier/prettier': 'error',
    semi: ['error', 'never'],
  },
  overrides: [
    {
      files: ['**/*.jsx', '**/*.js'],
      rules: {
        'react/prop-types': 'off'
      }
    }
  ]
}
