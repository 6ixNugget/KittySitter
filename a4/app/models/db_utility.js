var assert = require('assert');
exports.insertDocuments = function(db, newDoc, collection, callback) {
    var collection = db.collection(collection);
    collection.insertOne(newDoc, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
}

exports.findOne = function(db, req, collection, callback) {
    var collection = db.collection(collection);
    collection.find(req).toArray(function(err, docs) {
        if(docs.length == 0) {callback(null); return;}
        callback(docs);
    });
}

exports.findAll = function(db, collection, callback) {
    var collection = db.collection(collection);
    collection.find({}).toArray(function(err, docs) {
        callback(docs);
    });
}

exports.removeAll = function(db, collection, callback) {
   db.collection(collection).deleteMany( {}, function(err, results) {
      callback();
   });
};

exports.removeOne = function(db, req, collection, callback) {
    db.collection(collection).deleteOne(
        req,
        function(err, results) {
            callback();
        }
    );
};

exports.updateOne = function(db, req, newDoc, collection, callback) {
    console.log(req);
    console.log(newDoc);
   db.collection(collection).replaceOne(
       req,
       newDoc,
       function(err, results) {

            callback();
        });
};
