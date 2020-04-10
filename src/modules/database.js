class Database{

  schema = {};

  collection = '';

  getModel(){
    return Mongo.getModel(this.collection, this.schema);
  }

  create(data){
    Mongo.connect();
    let model = this.getModel();
    let doc = new model(data);
    return doc.save();
  }

  find(credentials, fields, options){
    Mongo.connect();
    return this.getModel().find(credentials, fields, options).then(r => r).catch(handleError);
  }

  findOne(credentials){
    Mongo.connect();
    return this.getModel().findOne(credentials).then(r => r).catch(handleError);
  }

  asJson(schema){
    return JSON.parse(JSON.stringify(schema));
  }

  asObjectId(id){
    return Mongo.asObjectId(id);
  }

  close(){
    Mongo.close();
  }

}

module.exports = Database;