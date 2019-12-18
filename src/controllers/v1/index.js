const Router = require('koa-router');
const userController = require('./user');

const router = new Router({ prefix: '/api/v1/' });

router.post('users', userController.createUser);
router.get('users', userController.getUsers);

module.exports = router;
