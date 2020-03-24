const Boom = require('@hapi/boom');

const { Group } = require('../models');
const userService = require('./user');
const config = require('../../configs');

/**
 *
 * @param {string} master 群主 id
 * @param {string} name 群名称
 */
async function createGroup(master, name) {
    const masterUser = await userService.findOneById(master);
    if (!masterUser) {
        throw Boom.badRequest(`the master id doesn't exist`, { code: 2 });
    }

    if (masterUser.groups.length > config.maxGroupCountPerUser) {
        throw Boom.forbidden(`user had already created max count groups`, { code: 3 });
    }

    const newGroup = new Group({ master, name });
    masterUser.groups.push(newGroup._id);
    await masterUser.save();
    return newGroup.save();
}

async function findGroupById(id) {
    return Group.findOne({ _id: id });
}

module.exports = {
    createGroup,
    findGroupById,
};
