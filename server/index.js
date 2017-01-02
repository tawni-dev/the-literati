const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const config = require('./config');

app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: config.secret,
  saveUninitialized: false,
  resave: true
}));

app.use(express.static(path.join(__dirname, "../public")));

/////////////
// DATABASE //
/////////////
app.set('db', require('./db'));

/////////////
// PASSPORT //
/////////////
require('./passport')(app);

/////////////
// ROUTES //
/////////////
require('./routes/auth')(app);

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
