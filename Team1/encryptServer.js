const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db');
const User = require('./usersArgon');
const cryptoJS = require('crypto-js');
var msg = '';
const user = new User();

app.set('port', process.env.PORT || 9020);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(app.methodOverridde);
// app.use(router);


function encryptChat(req) {
    return new Promise( function(resolve, reject) { 
        user.getUserByName(req.query.login).then( function(gubnResponse) {
            //console.log(gubnResponse)

            let encryptionKey = gubnResponse[0]._id.toString()
            //console.log("Encryption Key: " + encryptionKey)

            let ciphertext = cryptoJS.AES.encrypt( JSON.stringify(req.query.data), encryptionKey );
            let bytes  = cryptoJS.AES.decrypt(ciphertext.toString(), encryptionKey);
            let plaintext = bytes.toString(cryptoJS.enc.Utf8);
            console.log('\n Encrypted chat Message: ' + ciphertext.toString());
            console.log('\n Decrypted chat Message: ' + plaintext);
            const messageObject = {
                encryptedMsg: ciphertext.toString(),
                loginID: gubnResponse[0]._id
            }
            resolve(messageObject); 
        }, function (error) {
            console.log(error);
            reject(error);
        });        

    });
}

function saveData(req, messageObject) {

    let msgDate = new Date();

    let messageDate = User.formatDateTime(msgDate);

    // Do Stuff to get encrypted message

    let article  = '{ "Date" : "' + messageDate;
        article += '", "login" : "' + req.query.login;
        article += '", "message" : "' + messageObject.encryptedMsg + '" }';
    // article += '", "message" : "' + req.query.chatMessage + '" }';

    msg += 'Inserting record : \n' + article + '\n';
    console.log(msg);

    collection='safeStore'; 
    return new Promise(function(resolve, reject) {
        db().then(() => {
            db.Article.create(JSON.parse(article), collection).then((doc, err) => {
                const msg = 'Record inserted into Mongodb collection: ' + collection;
                console.log( 'docID: ' + doc.ops[0]._id);
                if (doc) {
                    const msgObject = {
                        _id: doc.ops[0]._id,
                        Date: messageDate,
                        login: req.query.login,
                        message: messageObject.encryptedMsg
                    }
                    resolve(msgObject);
                } else {
                    reject(err);
                }
            });
        });
    });
}

app.post('/enCryptData', function(req, res) {
    TimeNow = new Date();
    msg = '\n encrypt data Request recieved at: ' + TimeNow + '\n'; 
    console.log(msg);
    msg = "User: " + req.query.login
        + " data: " + req.query.data + '\n'; 
    console.log(msg);

    encryptChat(req).then( function(eData){
        saveData(req, eData).then( function(data) {
            User.successResponse('data safely encrytped', res);
        }, function(error) {
            User.failResponse(error, res);
        });
    }, function(error){
        User.failResponse(error, res);
    });

});


app.listen(app.get('port'), () => {
    console.log('Encrypt Server listening on: http://localhost:%s', app.get('port'));
});

module.exports = app;




