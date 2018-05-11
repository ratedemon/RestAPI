import Post from '../model/post';
import env from 'dotenv';
import User from '../model/user';

env.config();

export default class PostController {
    async createPost(ctx) {
        try {
            const post = await Post.create({
                title: ctx.request.body.title,
                description: ctx.request.body.description,
                user_id: ctx.request.body.id
            });
            const createdPost = await Post.findOne({
                where: {
                    id: post.id
                },
                include: [{
                    model: User,
                    as: 'user'
                }]
            });
            return ctx.body = createdPost;
        } catch (e) {
            console.log(e);
            return ctx.status = 403;
        }
    }

    async getPost(ctx) {
        try {
            const post = await Post.findOne({
                where: {
                    id: ctx.params.id
                },
                include: [{
                    model: User,
                    as: 'user'
                }]
            });
            return ctx.body = post;
        } catch (e) {
            console.log(e);
            return ctx.status = 403;
        }
    }

    async searchPost(ctx){
        try{
            const posts = await Post.findAll({
                where: ctx.request.query
            });
        }catch(e){
            console.log(e);
            return ctx.status = 403;
        }
    }
}