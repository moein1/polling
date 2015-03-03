var express = require('express');
var path = require('path');
var http = require('http');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', routes.vote);

// view engine setup
app.set('port', process.env.VCAP_APP_PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
//app.use(bodyParser.json());
app.use(express.methodOverride());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(app.router);
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler

app.use(function(err,req, res, next) {
    if (!err) return next();
    console.log(err.stack);
    res.json({ error: true });
});

app.get('/', routes.index);

app.get('/polls/polls', routes.list);

app.get('/polls/:id', routes.poll);
app.post('/polls', routes.create);

/*app.get('*', function (req, res) {
    res.redirect('/#' + req.originalUrl);
});*/


server.listen(app.get('port'), function () {
    console.log('We are listenning on podrt no ' + app.get('port'));
});


