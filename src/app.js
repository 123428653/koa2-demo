const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  // await next();
  ctx.body = '<h1>Hello Worl22d</h1>';
});

app.listen(3000);