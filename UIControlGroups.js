const fs = require('fs');
const USER_CONTROLS = 'views/template/userControlGroups.html';
const ADMIN_CONTROLS = 'views/template/adminControlGroups.html';
const LOGIN_CONTROLS = 'views/LoginUserGroups.html';
var msg = '';
var userForm = '';

class UIControls {
    constructor(obj) {
        for ( let key in obj ) {
            this [key] = obj [key];
        }
    }

    LoadLoginPage() {
        userForm = LOGIN_CONTROLS;
        msg = 'Reading from file' + userForm;
        console.log(msg);
        return new Promise(function(resolve, reject) {
            fs.readFile(userForm, (err, data) => {
                if (err) {
                    reject(Error(err));
                } else {                    
                    console.log(data);
                    resolve(data);
                }
            });
        });        
    }

    LoadPage(loginInfo) {

        var user = loginInfo[0].login;
        var role = loginInfo[0].role;

        msg = '\n User: ' + user + ' Role: ' + role + '\n';

        console.log(msg);

        if ( user == 'ADMIN' || role == 'ADMIN') {
            userForm = ADMIN_CONTROLS;
        } else {
            userForm = USER_CONTROLS;
        }
        msg = 'Reading from file' + userForm;
        console.log(msg);
        return new Promise(function(resolve, reject) {
            fs.readFile(userForm, (err, data) => {
                if (err) {
                    reject(Error(err));
                } else {                    
                    console.log(data);
                    resolve(data);
                }
            });
        });        
    }

}

module.exports = UIControls;