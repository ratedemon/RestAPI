import User from '../model/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

export default class UserController {
    async login(ctx) {
        const errors = [];
        try {
            const user = await User.findOne({
                where: {
                    email: ctx.request.body.email
                }
            });
            if (!user) {
                errors.push({
                    field: 'email',
                    message: 'Wrong email'
                });
                ctx.body = errors;
                return ctx.status = 422;
            }
            try {
                const compare = await bcrypt.compare(ctx.request.body.password, user.password);
                if (compare) {
                    const token = await UserController.createToken(user);
                    return ctx.body = {token: token};
                } else {
                    throw new Error();
                }
            } catch (e) {
                errors.push({
                    field: 'password',
                    message: 'Wrong password'
                });
                ctx.body = errors;
                return ctx.status = 422;
            }
            return ctx.throw(422, errors);
        } catch (e) {

        }
    }

    async register(ctx) {
        try {
            const hash = await bcrypt.hash(ctx.request.body.password, 10);
            let userData = {
                name: ctx.request.body.name,
                email: ctx.request.body.email,
                password: hash
            };
            if (!!ctx.request.body.phone) {
                userData.phone = ctx.request.body.phone;
            }
            const user = await User.create(userData);
            const token = await UserController.createToken(user);
            return ctx.body = {token: token};
        } catch (e) {
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


    async getCurrentUser(ctx) {
        try {
            const user = await User.findOne({
                where: {
                    id: ctx.request.body.id
                },
                attributes: {
                    exclude: ['password']
                }
            });
            if (!user) {
                throw new Error();
            }
            return ctx.body = user;
        } catch (e) {
            console.log(e);
            return ctx.status = 401;
        }
    }

    async updateCurrentUser(ctx) {
        let userData = {};
        try {
            if (ctx.request.body.hasOwnProperty('new_password') && ctx.request.body.hasOwnProperty('current_password')) {
                const user = await User.findOne({
                    where: {
                        id: ctx.request.body.id
                    }
                });
                const compare = await bcrypt.compare(ctx.request.body.current_password, user.password);
                if (compare) {
                    const hash = await bcrypt.hash(ctx.request.body.new_password, 10);
                    userData.password = hash;
                } else {
                    throw new Error('password');
                }
            }
            for (let key in ctx.request.body) {
                if (key != 'new_password' && key != 'current_password' && key != 'id') {
                    userData[key] = ctx.request.body[key];
                }
            }

            const userUpdated = await User.update(userData, {
                where: {
                    id: ctx.request.body.id
                }
            });

            const user = await User.findOne({
                where:{
                    id: ctx.request.body.id
                },
                attributes: {
                    exclude: ['password']
                }
            });

            return ctx.body = user;
        } catch (e) {
            const errors = [];
            if(e.message == 'password'){
                errors.push({
                    field: 'password',
                    message: 'Password is not equal to current password'
                })
            }else{
                errors.push({
                    field: e.errors[0].path,
                    message: e.errors[0].message
                });
            }
            ctx.body = errors;
            return ctx.status = 422;
        }
    }

    async getUserById(ctx){
        const user = await User.findOne({
            where: {
                id: ctx.params.id
            },
            attributes: {
                exclude: ['password']
            }
        });
        if(!user){
            return ctx.status = 404;
        }
        return ctx.body = user;
    }

    async searchUsers(ctx){
        for(let key in ctx.request.query){
            ctx.request.query[key] = {$like : `%${ctx.request.query[key]}%`};
        }
        const users = await User.findAll({
            where: ctx.request.query
        });
        return ctx.body = users;
    }

    static async createToken(user) {
        try {
            const token = await jwt.sign({id: user.id}, process.env.JWT_TOKEN, {expiresIn: "1h"});
            return token;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}