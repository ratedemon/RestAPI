import Joi from 'joi';

const defaultSchema = Joi.object().keys({
    email: Joi.string().required().regex(/[a-zA-Z_]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/, "email"),
    name: Joi.string().min(2).max(30),
    phone: Joi.string().regex(/^((\+380)+([0-9]){9})$/),
    password: Joi.string().min(6).max(24),
    current_password: Joi.string().min(6).max(24),
    new_password: Joi.string().min(6).max(24)
});


export async function loginValidation(ctx, next){
    try {
        const result = Joi.validate(ctx.request.body, defaultSchema);
        if(result.error){
            const error = [
                {
                    field: result.error.details[0].path[0],
                    message: result.error.details[0].message
                }
            ];
            ctx.body = error;
            return ctx.status = 401;
        }
        await next();
    }catch(e){
        console.log(e.details[0].path);
    }
}

export async function registerValidation(ctx, next){
    const result = Joi.validate(ctx.request.body, defaultSchema);
    if(result.error){
        const error = [
            {
                field: result.error.details[0].path[0],
                message: result.error.details[0].message
            }
        ];
        ctx.body = error;
        return ctx.status = 401;
    }
    await next();
}

export async function searchUserValidation(ctx, next){
    const result = Joi.validate(ctx.request.query, defaultSchema);
    if(result.error){
        return ctx.status = 401;
    }
    await next();
}