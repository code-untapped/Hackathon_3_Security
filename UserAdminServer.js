const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const User = require('./users');

app.set('port', process.env.PORT || 9010);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/createUser', (req, res) => {
    
    var login = req.query.login,
        password = req.query.password,
        role = req.query.role;
    
    TimeNow = new Date();
    msg = '\n Create User request received at: ' + TimeNow + '\n'; 
    msg += 'User: '  + login +'\n';
    msg += 'Role: '  + role +'\n';
    console.log(msg);
    const user = new User();


    user.getUserByName(login).then( (gubnResponse) => {

        console.log(gubnResponse);
        if ( gubnResponse.length > 0 ) {
            User.failResponse("User already exists", res);
        } else {
            user.hashPassword( password ).then( function(hpResponse){
                msg = '\n hashPassword: encryption details: \n';
                console.log(hpResponse);
                user.saveUser( hpResponse, login, role ).then( function(saveResponse){
                    User.successResponse('User created', res);
                }, function(error) {
                    User.failResponse(error, res);   
                });
            }, function(error) {
                User.failResponse('hashPassword: failure generating hash', res);    
            });
        }
    }, (error) => {
        User.failResponse(error, res)    
    });
    
});

app.listen(app.get('port'), () => {
    console.log('User Admin Server listening on: http://localhost:%s', app.get('port'));
});

module.exports = app;