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

/**
 * 消息相关 API
 * url 形式： messages/:situation/:contentType
 * 之所以 url 不直接用 messages，然后 situation 和 contentType 都放到 body，是因为这样方便把逻辑拆分到不同的 controller
 */
router.post('messages/private/text', messageController.sendPrivateTextMessage);
router.post('messages/private/image', messageController.sendPrivateImageMessage);

module.exports = router;
