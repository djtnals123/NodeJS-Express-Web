var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var logger = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
const helmet = require('helmet');
var crypto = require('crypto');
const csurf = require('csurf')

var routeLoader = require('./routes/route-loader');
var configPassport = require('./config/passport');
var userPassport = require('./routes/passport');


var app = express();
require('./init')(app);

app.set('../viewss', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
      styleSrc:  ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
    },
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(expressSession({
  secret:'key',
  resave:true,
  saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(csurf());
app.use(flash());
routeLoader.init(app);
configPassport(app, passport);
userPassport(app, passport);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);
module.exports = app;
