const Router = require('koa-router');
const userController = require('./user');

const router = new Router({ prefix: '/api/v1/' });

router.post('users/register', userController.register);
router.post('users/login', userController.login);
router.get('users', userController.getUsers);
router.get('users/:id', userController.getUserById);
router.put('users/:id', userController.updateUserById);

module.exports = router;
