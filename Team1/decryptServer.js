const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db');
const User = require('./usersArgon');
const cryptoJS = require('crypto-js');

app.set('port', process.env.PORT || 9030);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



function getUserDetails(collection, login) {
    msg = '\nUser List length: ' + collection.length;
    msg += '\nSearch User: ' + login;
    //console.log(msg);
    for (j=0; j < collection.length; j++ ) {
        if ( collection[j].login == login ) {
            return collection[j].user[0];
        }
    }
}


app.get('/decryptData', function(req, res) {
    TimeNow = new Date();
    msg = '\n decrypt data Request recieved at: ' + TimeNow + '\n'; 
    msg = "User: " + req.query.login + '\n'; 
    console.log(msg);

    let login  = req.query.login
    let article  = '{ "login" : "' + login + '" }';
    let bytes;
    let plaintext
    let serverResponse = '[';
    let encryptionKey = '';
    let noOfRecords;
    let limit;

    collection='safeStore';
    db().then(() => {
        db.Article.find(JSON.parse(article), collection).then( function(docs) {
            //console.log(docs)
            noOfRecords = docs.length;
            limit = noOfRecords - 1;
            if ( noOfRecords > 0 ) {
                const user = new User();

                user.getUserByName(login).then( (gubnResponse) => {

                    //console.log(gubnResponse)
                    //console.log(gubnResponse[0]._id.toString())
                    msg = 'No of group messages: ' + noOfRecords;
                    msg = '\nDelimiter limit: ' + limit;
                    //console.log(msg);
                
                    // Iterate through chat history decrypting each message
                    // with the hash from the Users profile.
                    for (i=0; i < noOfRecords; i++ ) {
                        let encryptionKey = gubnResponse[0]._id.toString()
                        msg = '\nCall: login: ' + docs[i].login + ' to getEncryptionKey: ' + encryptionKey ;
                        //console.log(msg);
                        bytes  = cryptoJS.AES.decrypt(docs[i].message, encryptionKey);
                        plaintext = bytes.toString(cryptoJS.enc.Utf8);

                        // construct JSON response                                
                        // serverResponse += '{ "Group" : "'    + cmResponse[i].Group;
                        serverResponse += '{ "_id" : "'      + docs[i]._id;
                        serverResponse += '" , "date" : "'   + docs[i].Date;
                        serverResponse += '" , "login" : "'  + docs[i].login;
                        serverResponse += '" , "encryptedData" : "'  + docs[i].message;
                        serverResponse += '" , "data" : '    + plaintext + ' }';

                        if ( noOfRecords > 1  && i < limit ) {
                            serverResponse += ',\n'
                        }
                    }
                    serverResponse += ']';
                    console.log(serverResponse);
                    res.writeHead(200, {'Content-Type': 'JSON'});
                    res.end(JSON.stringify(JSON.parse(serverResponse)));                

                    }, function (error) {
                        msg = 'getUserList: Unable to retrieve user details for group: ' + req.query.group;
                        User.failResponse(msg, res); 
                    });
            } else {
                msg = 'decryptServer: No documents have been saved: ' + req.query.group;
                User.failResponse(msg, res); 
            }
        }, function(error) {
            msg = 'decryptServer: Unable to retrieve documents' + req.query.group;
            User.failResponse(msg, res); 
        });

    });
});

app.listen(app.get('port'), () => {
    console.log('decrypt Server listening on: http://localhost:%s', app.get('port'));
});

module.exports = app;