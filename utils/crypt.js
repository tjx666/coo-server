const crypto = require('crypto');

function md5(data, encoding = 'hex') {
    const hash = crypto.createHash('md5');
    hash.update(data);
    return hash.digest(encoding);
}

module.exports = { md5 };
