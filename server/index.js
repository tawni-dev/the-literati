const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const socketSessions = require('socket.io-handshake');
const path = require('path');
const cookieParser = require('cookie-parser');
const MemoryStore = require('session-memory-store')(session);
const sessionStore = new MemoryStore();
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;
const config = require('./config');

app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  key: 'lit',
  secret: config.secret,
  store: sessionStore,
  saveUninitialized: false,
  resave: true
}));
io.use( socketSessions({ store: sessionStore, key: 'lit', secret: config.secret, parser: cookieParser() }) );

app.use(express.static(path.join(__dirname, "../public")));

/////////////
// DATABASE//
/////////////
app.set('db', require('./db'));

/////////////
// AUTH    //
/////////////
require('./passport')(app);

/////////////
// ROUTES  //
/////////////
require('./routes/auth')(app);
require('./routes/admin')(app);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});

/////////////
// CHAT    //
/////////////
require('./sockets')(app, io);
