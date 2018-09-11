var createError = require('http-errors');
const session = require("express-session");
const FileStore = require("session-file-store")(session);
 const sessionMiddleware = session({
  store:new FileStore(),
  secret:"keyboard cat",
  cookie:{ maxAge:600000}
})


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var iosession = require("express-socket.io-session")(sessionMiddleware,{autoSave:true});
server.listen(3000);
io.use(iosession);

//聊天室
io.on("connection",function(socket){
  // socket.handshake.session.save();
  socket.on("msg",function(value){
    console.log(value);
    var d = new Date();
    var date = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    io.emit("newmsg",value,date);
  })
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(sessionMiddleware);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

// module.exports = app;
