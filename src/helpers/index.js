const dbHelper = require('./db');
const logHelper = require('./log');
const restifyHelper = require('./restify');
const validateHelper = require('./validate');

module.exports = async function setupHelpers(app) {
    await logHelper(app);
    await dbHelper(app);
    await restifyHelper(app);
    await validateHelper(app);
};
