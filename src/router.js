import Router from 'koa-router';
import koaBody from 'koa-body';

import UserController from './controller/UserController';
import PostController from './controller/PostController';
import verifyAuth from './middleware/auth';
import {registerValidation, loginValidation, searchUserValidation} from './validator/user';
import {postValidation, searchPostValidation} from './validator/post';
import {upload} from './uploader';

const router = new Router({
    prefix: '/api'
});

const userController = new UserController();
const postController = new PostController();

router.use(koaBody());


router.post('/login', loginValidation, userController.login);
router.post('/register', registerValidation, userController.register);
router.get('/me', verifyAuth, userController.getCurrentUser);
router.put('/me', verifyAuth, userController.updateCurrentUser);
router.get('/user/:id', verifyAuth, userController.getUserById);
router.get('/user', verifyAuth, searchUserValidation, userController.searchUsers);

router.put('/item', verifyAuth, postValidation, postController.createPost);
router.put('/item/:id', verifyAuth, postValidation, postController.updatePost);
router.get('/item/:id', verifyAuth, postController.getPost);
router.get('/item', verifyAuth, searchPostValidation, postController.searchPost);
router.delete('/item/:id', verifyAuth, postValidation, postController.deletePost);
router.post('/item/:id/image', verifyAuth, upload.single('avatar'), postController.uploadImage);
router.delete('/item/:id/image', verifyAuth, postController.removeImage);

export function routes() {
    return router.routes();
}

export function allowedMethods() {
    return router.allowedMethods();
}