const _getPort = require('get-port');

module.exports = async function getPort(host, port) {
    const result = await _getPort({ host, port });

    if (result === port) {
        return result;
    }

    return getPort(host, port + 1);
};
