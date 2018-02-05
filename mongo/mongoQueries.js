

var mongoQueries = class MongoQueries {

  constructor(db){
    this.db = db;
  }

  createCollection(collectionName,callback){
    this.db.db('conbot').createCollection(collectionName, function(err, res) {
      if (err) throw err;
      callback(res,err);
    });
  }

  insertMany(collectionName,obj,callback){
    this.db.db("conbot").collection(collectionName).insertMany(obj, function(err, res) {
      if (err) throw err;
      callback({resp:"OK"},obj);
    });
  }

  insertOne(collectionName,obj,callback){
    this.db.db("conbot").collection(collectionName).insertOne(obj, function(err, res) {
      if (err) throw err;
      callback({resp:"OK"},obj);
    });
  }
  find(collectionName,callback){
    this.db.db("conbot").collection(collectionName).find({}).toArray(function(err, result) {
     if (err) throw err;
      callback(result);
    });
  }


}

module.exports = mongoQueries;
