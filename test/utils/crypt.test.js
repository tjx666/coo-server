const assert = require('assert');
const { md5 } = require('../../utils/crypt');

describe('#crypt', () => {
    describe('#md5', () => {
        it('should return md digest', () => {
            const digest = md5('admin');
            assert.strictEqual(digest, '21232f297a57a5a743894a0e4a801fc3');
        });
    });
});
