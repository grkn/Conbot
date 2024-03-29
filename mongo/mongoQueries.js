var mongoQueries = class MongoQueries {
  constructor(db){
    this.db = db;
  }
  createCollection(collectionName, callback){
    this.db.db('conbot').createCollection(collectionName, function(err, res) {
      if (err) throw err;
      callback(res, err);
    });
  }
  insertMany(collectionName, obj, callback){
    this.db.db("conbot").collection(collectionName).insertMany(obj, function(err, res) {
      if (err) throw err;
      callback({res:"OK"}, obj);
    });
  }
  insertOne(collectionName, obj, callback){
    this.db.db("conbot").collection(collectionName).insertOne(obj, function(err, res) {
      if (err) throw err;
      callback({res:"OK"}, obj);
    });
  }
  find(collectionName, callback){
    this.db.db("conbot").collection(collectionName).find({}).toArray(function(err, res) {
     if (err) throw err;
      callback(res);
    });
  }
  findWithLimit(collectionName, callback){
    this.db.db("conbot").collection(collectionName).find({}).limit(10).toArray(function(err, res) {
     if (err) throw err;
      callback(res);
    });
  }
  findByQuery(collectionName, query, callback){
    this.db.db("conbot").collection(collectionName).find(query).toArray(function(err, res) {
     if (err) throw err;
      callback(res);
    });
  }
  deleteCollection(collectionName){
      this.db.db("conbot").collection(collectionName).drop();
  }
  deleteFromTrainingMessage(message, callback){
    var myquery = {"message":{"text":message}};
      this.db.db("conbot").collection("training_messages").deleteMany(myquery, function(err, obj) {
    if (err) throw err;
      callback(obj);
    });
  }
  updateOne(collectionName, query, newValues, callback){
    this.db.db("conbot").collection(collectionName).update(query, newValues, function(err, res) {
     if (err) throw err;
      callback(res);
    });
  }
}

module.exports = mongoQueries;
