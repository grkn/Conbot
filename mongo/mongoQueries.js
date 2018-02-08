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
  findByQuery(collectionName, query, callback){
    this.db.db("conbot").collection(collectionName).find(query).toArray(function(err, res) {
     if (err) throw err;
      callback(res);
    });
  }
  deleteCollection(collectionName){
      this.db.db("conbot").collection(collectionName).drop();
  }
}

module.exports = mongoQueries;
