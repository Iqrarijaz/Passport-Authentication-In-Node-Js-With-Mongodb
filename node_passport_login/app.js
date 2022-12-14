const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

//=========== DB Config ==========//
const db = require('./config/keys').MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Mongoose.....');
  })
  .catch((err) => console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//======Passport
require('./config/passport')(passport);
//========== BodyParser ==========//
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//========== Connect Flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//routes
app.use('/', require('./routes/index'));

app.use('/users', require('./routes/user'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server listening on http://localhost:${PORT}`));
