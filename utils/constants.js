const { resolve } = require('path');

const validEnvNames = ['development', 'test', 'production'];
const ENV = process.env.NODE_ENV;
if (!validEnvNames.includes(ENV)) {
    throw new Error(`${ENV} is not a valid environment name in ${validEnvNames.join(', ')}`);
}

const PROJECT_ROOT = resolve(__dirname, '../');

module.exports = {
    ENV,
    PROJECT_ROOT,
};
