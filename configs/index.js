const { env } = require('../utils/env');

module.exports = {
    ...require(`./${env}.config`),
};
