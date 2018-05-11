import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

async function verifyAuth(ctx, next) {
    const authorization = ctx.headers.authorization;
    // console.log(authorization);
    try{
        const encode = await jwt.verify(authorization, process.env.JWT_TOKEN);
        ctx.request.body.id = encode.id;
        await next();
    }catch(e){
        console.log(e);
        ctx.body = {message: e.message};
        return ctx.status = 401;
    }
}

export { verifyAuth as default };