import Router from 'koa-router';
import koaBody from 'koa-body';

import User from './model/user';
import Post from './model/post';

import UserController from './controller/UserController';

const router = new Router({
    prefix: '/api'
});
const userController = new UserController();

router.use(koaBody());

router.post('/login', userController.login);
router.post('/register', userController.register);

export function routes() {
    return router.routes();
}

export function allowedMethods() {
    return router.allowedMethods();
}