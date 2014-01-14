var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('httpsport', process.env.HTTPS_PORT || 443);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.favicon());
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// global jade properties
var imgSize = 24;
app.locals({
    imgSize: imgSize,
    domain: 'bakker.pw',
    navList: [
        {name:'Home', href:'/', img:'/images/'+imgSize+'/workspace-switcher.png'},
        {name:'Minecraft', href:'/minecraft', img:'/images/'+imgSize+'/minecraft.png'},
        {name:'Torrent', href:'/torrent', img:'/images/'+imgSize+'/transmission.png'},
        {name:'XBMC', href:'/xbmc', img:'/images/'+imgSize+'/video-x-generic.png'},
        {name:'Router', href:'/router', img:'/images/'+imgSize+'/network-server.png'},
        {name:'About', href:'/about', img:'/images/'+imgSize+'/dialog-information.png'}
    ]
});

app.get('/', require('./routes/index'));
app.get('/minecraft', require('./routes/minecraft'));
app.get('/torrent', require('./routes/torrent'));
app.get('/xbmc', require('./routes/xbmc'));
app.get('/router', require('./routes/router'));
app.get('/about', require('./routes/about'));

var credentials = {key: fs.readFileSync('/home/pi/openssl/decrypted.private.key'), cert: fs.readFileSync('/home/pi/openssl/unified.crt')};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

httpsServer.listen(app.get('httpsport'), function(){
  console.log('Express server listening on port ' + app.get('httpsport'));
});
