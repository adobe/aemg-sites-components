/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:wdio/recommended'
    ],
    env: {
        commonjs: true,
        es2017: true,
        node: true,
        mocha: true
    },
    parserOptions: {
        ecmaVersion: 9
    },
    rules: {
        'semi': ['error'],
        'semi-spacing': ['error', { before: false, after: true }],
        'semi-style': ['error', 'last'],
        'quotes': ['error', 'single'],
        'indent': ['error', 4],
        'no-trailing-spaces': ['error']
    },
    'plugins': [
        'wdio'
    ],
};
