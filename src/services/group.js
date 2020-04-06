const Boom = require('@hapi/boom');

const { Group } = require('../models');
const userService = require('./user');
const config = require('../../configs');

async function createGroup(master, name) {
    const masterUser = await userService.findOneById(master);
    if (!masterUser) {
        throw Boom.badRequest(`the master id doesn't exist`, { code: 2 });
    }

    if (masterUser.groups.length > config.maxGroupCountPerUser) {
        throw Boom.forbidden(`user had already created max count groups`, { code: 3 });
    }

    const newGroup = new Group({ master, name, members: [master] });
    await newGroup.save();

    masterUser.groups.push(newGroup._id);
    await masterUser.save();
}

async function findGroupById(id) {
    return Group.findOne({ _id: id });
}

async function applyForGroup(userId, groupId) {
    const user = await userService.findOneById(userId);
    if (!user) {
        throw Boom.badRequest('user not existed', { data: { code: 2 } });
    }

    if (user.groups.includes(groupId)) {
        throw Boom.badRequest('user had been the member of group!', { data: { code: 3 } });
    }

    user.groups.push(groupId);
    await user.save();

    const group = await findGroupById(groupId);
    group.members.push(userId);
    await group.save();
}

async function exitGroup(userId, groupId) {
    const user = await userService.findOneById(userId);
    if (!user) {
        throw Boom.badRequest('user not existed', { data: { code: 2 } });
    }

    const groupIndex = user.groups.findIndex((gid) => gid === groupId);
    if (groupIndex === -1) {
        throw Boom.badRequest('user not in the group', { data: { code: 3 } });
    }
    user.groups.splice(groupIndex, 1);
    await user.save();

    const group = await findGroupById(groupId);
    const userIndex = group.members.findIndex((uid) => uid === userId);
    group.members.splice(userIndex, 1);
    await group.save();
}

async function disbandGroup(master, groupId) {
    const group = await findGroupById(groupId);
    await Promise.all(
        group.members.map((uid) => {
            return (async () => {
                const user = await userService.findOneById(uid);
                const disbandedGroupIndex = user.groups.findIndex((gid) => gid === groupId);
                user.groups.splice(disbandedGroupIndex, 1);
                await user.save;
            })();
        }),
    );
    await Group.deleteOne({ _id: groupId });
}

module.exports = {
    createGroup,
    findGroupById,
    applyForGroup,
    disbandGroup,
    exitGroup,
};
