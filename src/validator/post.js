import Joi from 'joi';

const defaultSchema = Joi.object().keys({
    id: Joi.number().integer(),
    title: Joi.string().min(3).max(255),
    description: Joi.string().min(3),
    image: Joi.string().uri({allowRelative: true}),
    price: Joi.number(),
    order_by: Joi.string().valid('price', 'createdAt'),
    order_type: Joi.string().valid('asc', 'desc')
});

export async function postValidation(ctx, next) {
    try {
        const result = Joi.validate(ctx.request.body, defaultSchema);
        if(result.error){
            console.log(result.error);
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
        console.log(e);
    }
}

export async function searchPostValidation(ctx, next) {
    try {
        const result = Joi.validate(ctx.request.query, defaultSchema);
        if(result.error){
            console.log(result.error);
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
        console.log(e);
    }
}