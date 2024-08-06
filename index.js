const express = require("express");
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./middleware/auth')

const PORT = process.env.SERVER_PORT || 3000;
const DB_PORT = process.env.DB_PORT || 'mongodb://root:example@mongo:27017/';
const mainUrl = process.env.MAIN_URL || '/api';

const error404 = require('./middleware/404');
const booksRouter = require('./routes/api/books');
const usersRouter = require('./routes/api/users');

const app = express();
const server = http.Server(app);
const io = socketIO(server);


app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'SECRET'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(mainUrl + '/books', booksRouter);
app.use(mainUrl + '/user', usersRouter);
app.use(error404);

io.on('connection', (socket) => {
  const { id } = socket;
  console.log('connection ' + id);

  socket.on('message-to-me', (msg) => {
    msg.type = 'me';
    socket.emit('message-to-me', msg);
  })

  socket.on('message-to-all', (msg) => {
    msg.type = 'all';
    socket.broadcast.emit('message-to-all', msg);
    socket.emit('message-to-all', msg);
  })

  const { roomName } = socket.handshake.query;
  console.log('roomname ' + roomName);
  socket.join(roomName);
  
  socket.on('message-to-room', (msg) => {
    msg.type = `roomName: ${roomName}`;
    socket.to(roomName).emit('message-to-room', msg);
    socket.emit('message-to-room', msg);
  })

  socket.on('disconnect', () => {
    console.log('disconnect ' + id);
  })
})

async function start(PORT, DB_PORT) {
  try {
    await mongoose.connect(DB_PORT);
    server.listen(PORT, () => {
      console.log(`Library started at port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start(PORT, DB_PORT);