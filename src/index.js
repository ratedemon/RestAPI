import Koa from 'koa';
import env from 'dotenv';

env.config();

const app = new Koa();

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening on port ${process.env.PORT}...`);
});