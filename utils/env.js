const { resolve } = require('path');
const { argv } = require('yargs');

const env = argv.env || process.env.NODE_ENV || 'production';
const isProd = !['development', 'test'].includes(env);
const projectRoot = resolve(__dirname, '../');

module.exports = {
    env,
    isProd,
    projectRoot,
    resolvePath: resolve,
};
