const crypto = require('crypto');

function md5(input) {
    const hash = crypto.createHash('md5');
    hash.update(input);
    return hash.digest('hex');
}

module.exports = { md5 };
