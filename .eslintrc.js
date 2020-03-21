const eslint = {
  /* // react
  'env': { 'browser': true, 'es6': true },
  'extends': [ 'eslint:recommended', 'plugin:react/recommended' ],
  'parserOptions': { 
    'ecmaFeatures': { 'jsx': true }, 
    'ecmaVersion': 2018, 
    'sourceType': 'module' 
  },
  'plugins': [ 'react' ], 
  // end react */

  // node.js
  'env': { 'browser': true, 'commonjs': true, 'es6': true },
  'extends': 'eslint:recommended',
  'parserOptions': { 'ecmaVersion': 2018 },
  // end node.js

  //common
  'globals': { 'Atomics': 'readonly', 'SharedArrayBuffer': 'readonly' },
  'rules': { 
    'indent': [ 'error', 2 ],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'max-len': ['error', 80],
    'no-var': ['error'],
    'space-in-parens': ['error', 'never'],
    'array-bracket-spacing': ['error', 'always', { 'singleValue': false } ],
    'object-curly-spacing': ['error', 'always'],
    'object-shorthand': ['error', 'always'],
    'block-spacing': ['error', 'always'],
    'nonblock-statement-body-position': ['error', 'beside'],
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true } ],
    'curly': ['error', 'multi-or-nest'],
    'arrow-parens': ['error', 'always'],
    'arrow-body-style': ['error', 'as-needed'],
    'no-confusing-arrow': ['error', { 'allowParens': true } ],
    'arrow-spacing': ['error', { 'before': true, 'after': true } ],
    'comma-spacing': ['error', { 'before': false, 'after': true } ],
    'comma-dangle': ['error', 'never'],
    'jsx-quotes': ['error', 'prefer-single'],
    'capitalized-comments': ['error', 'never'],
    'lines-around-comment': ['error', { 
      'beforeBlockComment': true,
      'afterBlockComment': true,
      'beforeLineComment': true, 
      'afterLineComment': true
    }]
  }
}; 


module.exports = eslint; 