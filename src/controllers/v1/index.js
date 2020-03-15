const Router = require('@koa/router');

const userController = require('./user');
const messageController = require('./message');

const router = new Router({ prefix: '/api/v1/' });

// user
router.post('users/register', userController.register);
router.post('users/login', userController.login);

router.get('users', userController.getUsers);
router.get('users/:id', userController.getUserById);
router.get('users/:id/friends', userController.getFriends);

router.put('users/:id', userController.updateUserById);
router.put('users/:id/avatar', userController.uploadAvatar);

router.post('users/:id/friends', userController.applyForNewFriend);
router.delete('users/:id/friends', userController.removeFriend);

router.get('search/user', userController.searchUserByEmail);

// message
router.post('messages/private/text', messageController.sendUserToUserTextMessage);

module.exports = router;
