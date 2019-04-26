const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const User = require('./usersArgon');
const user = new User();


app.set('port', process.env.PORT || 8880);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/authenticate', (req, res) => {
    const login = req.query.login;
    const password = req.query.password;

    user.authenticate(login, password).then(function(docs) {
        console.log(docs);
        user.successHTMLResponse('Login ' + login + ' authenticated', res, docs);
    }, function(error) {
        User.failResponse(error, res);
    })
    .catch((error) => {
        User.failResponse(error, res);
    });
    
});

app.listen(app.get('port'), () => {
    console.log('Login Server listening on: http://localhost:%s', app.get('port'));
});

module.exports = app;