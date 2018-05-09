import User from '../model/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

export default class UserController{
    async login(ctx){
        const errors = [];
        try{
            const user = await User.findOne({
                where: {
                    email: ctx.request.body.email
                }
            });
            if(!user){
                errors.push({

                    field: 'email',
                    message: 'Wrong email'
                });
                ctx.body = errors;
                return ctx.status = 422;
            }
            try{
                const compare = await bcrypt.compare(ctx.request.body.password, user.password);
                if(compare){
                    const token = await UserController.createToken(user);
                    return ctx.body = {token: token};
                } else {
                    throw new Error();
                }
            }catch(e){
                errors.push({
                    field: 'password',
                    message: 'Wrong password'
                });
                // console.log(e);
                ctx.body = errors;
                return ctx.status = 422;
            }
            return ctx.throw(422, errors);
        }catch(e){

        }
    }
    async register(ctx){
        try {
            const hash = await bcrypt.hash(ctx.request.body.password, 10);
            let userData = {
                name: ctx.request.body.name,
                email: ctx.request.body.email,
                password: hash
            };
            if(!!ctx.request.body.phone){
                userData.phone = ctx.request.body.phone;
            }
            const user = await User.create(userData);
            const token = await UserController.createToken(user);
            return ctx.body = {token: token};
        }catch(e){
            return ctx.throw(422);
        }
    }
    static async createToken(user){
        try{
            const token = await jwt.sign({id: user.id, email: user.email}, process.env.JWT_TOKEN, {expiresIn: "1h"});
            return token;
        }catch (e) {
            console.log(e);
            return e;
        }
    }
}