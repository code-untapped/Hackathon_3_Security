const { MongoClient, ObjectID } = require('mongodb');
const assert = require('assert');

let db,
    clientConn,
    msg="";

const dbName = 'test2';
const url = 'mongodb://localhost:27017';

//console.log(url);


module.exports = () => {
    return MongoClient
        .connect(url, {
            useNewUrlParser: true
        })
        .then((client) => {
            db = client.db(dbName);
            clientConn = client;
        });
};

module.exports.Article = {


    find(query, collection) {
        return new Promise(function(resolve, reject){
            db.collection(collection)
            .find(query)
            .toArray().then( function(docs) {
                resolve(docs);
                clientConn.close();
            }, function(error) {
                reject(error);
                clientConn.close();
            });
        });
    },

    create(data, collection) {
        return new Promise(function(resolve, reject){
            db.collection(collection).insertOne(data, { w: 1 }, function(err, docs){
                
                if (err) {
                    reject(Error("create: Unable to create record in collection: " + collection));
                    clientConn.close();    
                } else {
                    //console.log(docs);
                    resolve(docs);
                    clientConn.close();
                }
            });
        });
    },


    deleteID(query, collection) {
        query = ObjectID(query);
        return new Promise(function(resolve, reject) {
            db.collection(collection).remove({ "_id" : query }, { w: 1 }, function(err, docs){
                if (err) {
                    reject(Error("deleteID: Unable to delete record in collection: " + collection));
                    clientConn.close();    
                } else {
                    //console.log(docs);
                    resolve(docs);
                    clientConn.close();
                }
            });
        });
    },

    delete(query, collection) {
        return new Promise(function(resolve, reject) {
            db.collection(collection).remove(query, { w: 1 }, function(err, docs){
                if (err) {
                    reject(Error("delete: Unable to delete record in collection: " + collection));
                    clientConn.close();    
                } else {
                    //console.log(docs);
                    resolve(docs);
                    clientConn.close();
                }
            });
        });
    },
};

