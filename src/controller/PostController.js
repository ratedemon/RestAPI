import Post from '../model/post';
import env from 'dotenv';
import User from '../model/user';
import db from '../db';
import fs from 'fs';

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
                    as: 'user',
                    attributes: {
                        exclude: ['password']
                    }
                }]
            });
            return ctx.body = createdPost;
        } catch (e) {
            console.log(e);
            const errors = [
                {
                    field: e.errors[0].path,
                    message: e.errors[0].message
                }
            ];
            ctx.body = errors;
            return ctx.status = 422;
        }
    }

    async updatePost(ctx){
        try {
            let postData = {};
            if(!!ctx.request.body.title){
                postData.title = ctx.request.body.title;
            }
            if(!!ctx.request.body.description){
                postData.description = ctx.request.body.description;
            }
            const post = await Post.update(postData,{
                where: {
                    id: ctx.params.id,
                    user_id: ctx.request.body.id
                }
            });
            if(post.includes(0)){
                return ctx.status = 404;
            }
            const updatedPost = await Post.findOne({
                where: {
                    id: ctx.params.id,
                    user_id: ctx.request.body.id
                },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: {
                        exclude: ['password']
                    }
                }]
            });
            return ctx.body = updatedPost;
        }catch(e){
            const errors = [
                {
                    field: e.errors[0].path,
                    message: e.errors[0].message
                }
            ];
            ctx.body = errors;
            return ctx.status = 422;
        }
    }

    async deletePost(ctx){
        try{
            const post = await Post.destroy({
                where: {
                    id: ctx.params.id,
                    user_id: ctx.request.body.id
                }
            });
            if(!post){
                return ctx.status = 404;
            }
            return ctx.status = 200;
        }catch(e){
            console.log(e);
            const errors = [
                {
                    field: e.errors[0].path,
                    message: e.errors[0].message
                }
            ];
            ctx.body = errors;
            return ctx.status = 422;
        }
    }

    async getPost(ctx) {
        try {
            const post = await Post.findOne({
                where: {
                    id: ctx.params.id
                },
                attributes: {
                    exclude: ['price']
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
            let order_by = 'createdAt';
            let order_type = 'desc';
            if(!!ctx.request.query.order_by){
                order_by = ctx.request.query.order_by;
            }
            if(!!ctx.request.query.order_type){
                order_type = ctx.request.query.order_type;
            }
            for(let key in ctx.request.query){
                if(key != 'order_type' && key != 'order_by'){
                    if(key != 'user_id'){
                        ctx.request.query[key] = {$like : `%${ctx.request.query[key]}%`};
                    }
                }else{
                    delete ctx.request.query[key];
                }
            }
            const posts = await Post.findAll({
                where: ctx.request.query,
                include: [{
                    model: User,
                    as: 'user',
                    attributes: {
                        exclude: ['password']
                    }
                }],
                order: [[order_by, order_type.toUpperCase()]]
            });
            return ctx.body = posts;
        }catch(e){
            console.log(e);
            return ctx.status = 403;
        }
    }

    async uploadImage(ctx){
        try {
            const { file } = ctx.req;

            const image = await Post.update({
                image: file.path
            }, {
                where: {
                    id: ctx.params.id,
                    user_id: ctx.request.body.id
                }
            });
            if(image.includes(0)){
                return ctx.status = 404;
            }

            return ctx.status = 200;
        }catch(e){
            console.log(e);
            ctx.status = 403;
        }
    }

    async removeImage(ctx){
        try{
            const post = await Post.findOne({
                where: {
                    id: ctx.params.id,
                    user_id: ctx.request.body.id
                }
            });

            if(!post){
                return ctx.status = 404;
            }

            const image = await fs.unlink(post.image);

            const postImage = await Post.update({
                image: null
            },{
                where: {
                    id: ctx.params.id,
                    user_id: ctx.request.body.id
                }
            });
            console.log(image);

            return ctx.status = 200;
        }catch(e){
            console.log(e);
            return ctx.status = 403;
        }
    }
}