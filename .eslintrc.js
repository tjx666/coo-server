module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: ['airbnb-base', 'prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        request: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'func-names': 0,
        'global-require': 0,
        'no-console': 0,
        'no-param-reassign': 0,
        'no-underscore-dangle': 0,
        'no-unused-expressions': 0,
        'no-unused-vars': 1,

        'import/newline-after-import': 0,
        'import/no-dynamic-require': 0,
    },
};
