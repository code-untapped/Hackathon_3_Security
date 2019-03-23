const assert = require('assert');
const db = require('./db');
const crypto = require('crypto');
const UIControls = require('./UIControlGroups');
const userUIControls = new UIControls();
let msg = '';
let collection = '';
let TimeNow;
const PASSWORD_LENGTH = 256;
const SALT_LENGTH = 128;
const ITERATIONS = 10000;
const DIGEST = 'sha256';  // hashing algorithm
const BYTE_TO_STRING_ENCODING = 'base64';

// verify syntax for moving function inside class then I can call from 
// micro-services.

class User {
    constructor(obj) {
        for ( let key in obj ) {
            this [key] = obj [key];
        }
    }

    static failResponse (err, res) {
        const response = { success : 'FAIL',
                     message : err };
        console.log(JSON.stringify(response));
    
        res.status(403).send(JSON.stringify(response));
    }
    
    static successResponse(err, res) {
        const response = { success : 'OK',
                           message : err };
        console.log(JSON.stringify(response));
    
        res.writeHead(200, {'Content-Type': 'JSON'});
        res.end(JSON.stringify(response));
    }

    successHTMLResponse(err, res, loginInfo) {
        const response = { success : 'OK',
                 message : err };

        console.log(JSON.stringify(response));
        userUIControls.LoadPage(loginInfo).then( function(data) {
            msg = 'authenticate response: \n' + data;
            console.log(msg);
            res.writeHead(200, {'Content-Type': 'HTML'});
            res.end(data);        
        }, function(error) {
            console.log(error);
        });
    }


    hashPassword(password) {
        return new Promise(function(resolve, reject) {
            var salt = crypto.randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING);
            msg = "\n salt: <" + salt + "> \n saltLength: <" + SALT_LENGTH + "> \n encoding: <" + BYTE_TO_STRING_ENCODING + ">";
            msg += "\n password : <" + password + ">";
            console.log(msg);
            crypto.pbkdf2(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST, (error, hash) => {
                if ( error ) {
                    reject(error);
                } else {
                    console.log(hash.toString(BYTE_TO_STRING_ENCODING));
                    resolve({
                        salt : salt,
                        hash : hash.toString(BYTE_TO_STRING_ENCODING),
                        iterations : ITERATIONS
                    });
                }
            });
        })
    }

    isPasswordCorrect( loginInfo, passwordAttempt ) {
        var savedSalt = loginInfo[0].salt;
        var savedHash = loginInfo[0].hash;
        var savedIterations = loginInfo[0].iterations;
        return new Promise(function(resolve, reject) {
            crypto.pbkdf2(passwordAttempt, savedSalt, savedIterations, PASSWORD_LENGTH, DIGEST, (error, hash) => {
                if ( error ) {
                    reject(error);
                } else {
                    msg = "isPasswordCorrect: generated hash: " + hash.toString(BYTE_TO_STRING_ENCODING);
                    //console.log(msg);
                    resolve(savedHash == hash.toString(BYTE_TO_STRING_ENCODING));
                }
            });
        });
    }

    getUserByName(userName) {
        let query;
        query = '{ "login" : "' + userName + '" }';
        
        collection = 'users'
        //console.log(JSON.parse(query));
        //console.log(collection);
        return new Promise(function(resolve, reject) {
            db().then(() => {
                db.Article.find(JSON.parse(query), collection).then((docs, err) => {
                    assert.equal(err, null);
                    msg = 'getUserByName: Retrieving Data from Mongodb collection: ' + collection + '\n'; 
                    msg += 'getUserByName: User details retrieved for: ' + userName + '\n'; 
                    //console.log(msg);
                    //console.log(docs);
                    if (docs) {
                        resolve(docs);
                    } else {
                        reject(Error("login info not found"));
                    }                
                });
            });
        });
    }

    authenticate(login, password) {
        TimeNow = new Date();
        msg = '\n Authentication Request recieved at: ' + TimeNow + '\n'; 
        console.log(msg);
        let that = this;
        return new Promise( function(resolve, reject){
            that.getUserByName(login).then( function(gubnResponse) {
                msg = '\n response length: <' + gubnResponse.length + '>';
                //console.log(msg);
                //console.log(gubnResponse);
                if ( gubnResponse.length > 0 ) {
                    that.isPasswordCorrect( gubnResponse, password ).then( function(ipcResponse ) {
                        //console.log(ipcResponse);
                        if (ipcResponse) {
                            resolve(gubnResponse)
                        } else {
                            reject('isPasswordCorrect: User not authenticated invalid password')
                        }
                    }, function(error) {
                        console.log(error);
                        reject('isPasswordCorrect: User not authenicated');
                    });
                } else {
                    reject('getUserByName: User does not exist')
                }        
            }, function(error){
                console.log(error);
                reject('getUserByName: User not authenticated');
            });
        });
    }

    saveUser( loginInfo, userName, role ) {
        return new Promise(function(resolve, reject){

            let userRecord = '{ "login" : "'       + userName;
                userRecord += '", "role" : "'      + role;
                userRecord += '", "salt" : "'      + loginInfo.salt;
                userRecord += '", "hash" : "'      + loginInfo.hash;
                userRecord += '", "iterations" : ' + loginInfo.iterations + ' }';

            msg += 'Creating User Record : \n' + userRecord + '\n';
            console.log(msg);
            collection='users';
            
            db().then(() => {
                db.Article.create(JSON.parse(userRecord), collection).then((userDocs, err) => {            
                    assert.equal(err, null);
                    
                    if (err) {
                        reject(Error("save: Unable to save login details to groups document"));
                    } else {
                        msg = 'save: Record inserted into Mongodb collection: ' + collection + '\n';
                        console.log(msg);
                        console.log("Inserted count: " + userDocs.insertedCount);
                        resolve(userDocs.insertedCount);
                    }
                })
            });
        })                        
    }
}

module.exports = User;