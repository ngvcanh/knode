const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
const { hostname, port, database } = config.database.mongodb;

class Mongo{

  options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }

  url = `mongodb://${ hostname }:${ port }/${ database }`;

  connnected = false;

  connect(){
    if (!this.connnected){
      mongoose.connect(this.url, this.options).then(() => {}).catch(handleError);
      this.connnected = true;
    }
  }

  createSchema(schema){
    return new mongoose.Schema(schema);
  }

  getModel(collectionName, collectionSchema){
    return mongoose.models[collectionName] || mongoose.model(collectionName, collectionSchema);
  }

  close(){
    mongoose.connection.close();
    this.connnected = false;
  }

  getObjectId(){
    return mongoose.Types.ObjectId;
  }

  asObjectId(id){
    return new mongoose.Types.ObjectId(id);
  }
}

module.exports = new Mongo;