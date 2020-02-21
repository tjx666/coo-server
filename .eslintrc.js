const OFF = 0;

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
        'func-names': OFF,
        'global-require': OFF,
        'no-console': OFF,
        'no-param-reassign': OFF,
        'no-underscore-dangle': OFF,
        'no-unused-expressions': OFF,
        'no-unused-vars': OFF,

        'import/newline-after-import': OFF,
        'import/no-dynamic-require': OFF,
    },
};
