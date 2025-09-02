module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.eslint.json',
  },
  env: {
    browser: true,
    amd: true,
    node: true,
    jest: true,
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    // '@typescript-eslint/no-for-in-array': 'error',
    // '@typescript-eslint/prefer-regexp-exec': 'error',
    // '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    // 'require-await': 'off',
    // '@typescript-eslint/require-await': 'error',
    // 'no-var': 'error',
    // 'prefer-const': 'error',
    // 'prefer-rest-params': 'error',
    // 'prefer-spread': 'error',
    'react/display-name': 'off',
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/prop-types': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/promise-function-async': 2,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
