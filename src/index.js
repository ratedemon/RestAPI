import Koa from 'koa';
import env from 'dotenv';
import {routes, allowedMethods} from "./router";

env.config();

const app = new Koa();

app.use(routes());
app.use(allowedMethods());

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening on port ${process.env.PORT}...`);
});

export default server;