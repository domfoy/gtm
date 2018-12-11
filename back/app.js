const http = require('http');

const io = require('socket.io');
const Koa = require('koa');
const Router = require('koa-router');

const socketHandler = require('./src/socket');

const app = new Koa();
const router = new Router();

router.get('/ping', (ctx) => {ctx.body = 'OK';});

const server = http.createServer(app.callback());
const _io = io(server);

socketHandler(_io);

module.exports = server;
