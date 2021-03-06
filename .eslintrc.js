const OFF = 0;
const ERROR = 2;

module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: [
        'airbnb-base',
        'plugin:eslint-comments/recommended',
        'plugin:node/recommended-script',
        'plugin:promise/recommended',
        'plugin:mocha/recommended',
        'plugin:unicorn/recommended',
        'prettier',
    ],
    plugins: ['promise', 'mocha', 'unicorn'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        request: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'eslint-comments/disable-enable-pair': [ERROR, { allowWholeFile: true }],

        'mocha/no-mocha-arrows': OFF,

        'import/newline-after-import': OFF,
        'import/no-dynamic-require': OFF,

        'unicorn/prevent-abbreviations': OFF,
        'unicorn/filename-case': [
            ERROR,
            {
                cases: {
                    camelCase: true,
                },
            },
        ],
        'unicorn/no-process-exit': OFF,

        'func-names': OFF,
        'global-require': OFF,
        'no-console': OFF,
        'no-param-reassign': OFF,
        'no-plusplus': OFF,
        'no-underscore-dangle': OFF,
        'no-unused-expressions': OFF,
        'no-unused-vars': OFF,
        'prefer-const': [ERROR, { destructuring: 'all' }],
    },
};
