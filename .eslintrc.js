const eslint = {
  'env': { 'browser': true, 'commonjs': true, 'es6': true },
  'extends': 'eslint:recommended',
  'parserOptions': { 'ecmaVersion': 2018 },
  'globals': { 'Atomics': 'readonly', 'SharedArrayBuffer': 'readonly' },
  'rules': { 
    'no-unused-vars': [ 'error', { 'args': 'none' }],
    'indent': [ 'error', 2 ],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'max-len': ['error', 100],
    'no-var': ['error'],
    'space-in-parens': ['error', 'never'],
    'array-bracket-spacing': ['error', 'always', { 'singleValue': false } ],
    'object-curly-spacing': ['error', 'always'],
    'object-shorthand': ['error', 'always'],
    'block-spacing': ['error', 'always'],
    'nonblock-statement-body-position': ['error', 'any'],
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true } ],
    'arrow-body-style': ['error', 'as-needed'],
    'no-confusing-arrow': ['error', { 'allowParens': true } ],
    'arrow-spacing': ['error', { 'before': true, 'after': true } ],
    'comma-spacing': ['error', { 'before': false, 'after': true } ],
    'comma-dangle': ['error', 'never'],
    'jsx-quotes': ['error', 'prefer-single'],
    'capitalized-comments': ['error', 'never'],
    'lines-around-comment': ['error', { 
      'beforeBlockComment': true,
      'beforeLineComment': true, 
    }]
  }
}; 


module.exports = eslint; 