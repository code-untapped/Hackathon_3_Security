const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy'); // TODO: Ensure this is directly registered in package.json
const UIControls = require('./UIControlGroups');
const proxy = httpProxy.createProxyServer({});


const app = express();


const loginServiceProxy = (req, res) => proxy.web(req, res, {target: 'http://localhost:8880'});
const userAdminServiceProxy = (req, res) => proxy.web(req, res, {target: 'http://localhost:9010'});
const encryptServiceProxy = (req, res) => proxy.web(req, res, {target: 'http://localhost:9020'});
const decryptServiceProxy = (req, res) => proxy.web(req, res, {target: 'http://localhost:9030'});
const companyDataServiceProxy = (req, res) => proxy.web(req, res, {target: 'http://localhost:9040'});


app.set('port', process.env.PORT || 3000);
// app.set('httpsPort', process.env.HTTPS_PORT || 3000); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));
// app.use(busboy());

app.use((req, res, next) => {
    // TODO: Check for NODE_ENV development
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/login', (req,res, next) => {
    TimeNow = new Date();
    msg = '\n Login Request recieved at: ' + TimeNow + '\n'; 
    console.log(msg);

    const userUIControls = new UIControls();
    userUIControls.LoadLoginPage().then( function(data) {
        msg = 'Login response: \n' + data;
        console.log(msg);
        res.writeHead(200, {'Content-Type': 'HTML'});
        res.end(data);        
    }, function(error) {
        console.log(error);
    });
});

app.get('/authenticate', (req, res) => {
    loginServiceProxy(req, res);
});

app.post('/createUser', (req, res) => {
    userAdminServiceProxy(req, res);
});

app.post('/enCryptData', (req, res) => {
    encryptServiceProxy(req, res);
});

app.get('/decryptData', (req, res) => {
    decryptServiceProxy(req, res);
});

app.get('/crunchdata', (req, res) => {
    companyDataServiceProxy(req, res);
});



const httpServer = http.createServer(app);

httpServer.listen(app.get('port'), () => {
    console.log('App Server listening on: http://localhost:%s', app.get('port'));
});

module.exports = app;