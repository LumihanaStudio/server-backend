var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hangul');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var word = require('./routes/word');
var version = require('./routes/version');
var mydic = require('./routes/mydic');
var board = require('./routes/board');
var image = require('./routes/image');

var app = express();

var UserSchema = new mongoose.Schema({
  userid:{type: String, required:true, unique:true},
  pw:{type: String, required:true},
  username: {type: String},
  apikey: {type: String},
  token: {type: String}
});


var WordSchema = new mongoose.Schema({
  id: {type: String},
  word: {type: String},
  mean: {type: String},
  ex: {type:String},
  see: {type: Number},
  similar: [String],
  cata: [String],
  tag: [String]
});

var MydicSchema = new mongoose.Schema({
    owner: {type: String},
    dicname: {type: String},
    sub: {type: String},
    favorite: [String]
});


var BoardSchema = new mongoose.Schema({
     boardid: {type: String},
     title: {type: String},
     writer: {type: String},
     writerToken: {type: String},
     date: {type: String},
     contents: {type: String},
     imageurl: {type: String},
     good: {type: Number},
     bad: {type: Number},
     share: {type: Number}
});

var CommentSchema = new mongoose.Schema({
    writer: {type: String},
    boardid: {type: String},
    date: {type: String},
    summary: {type: String}
});

Users = mongoose.model('users', UserSchema);
Words = mongoose.model('words', WordSchema);
Boards = mongoose.model('boards', BoardSchema);
Mydics = mongoose.model('mydics', MydicSchema);
Comments = mongoose.model('comments', CommentSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/auth', auth);
app.use('/word', word);
app.use('/version', version);
app.use('/mydic', mydic);
app.use('/board', board);
app.use('/image', image);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
