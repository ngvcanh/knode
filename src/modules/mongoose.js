const mongoose = require('mongoose');

class Mongoose{

  config = {};

  options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }

  mongoose = null;

  constructor(){
    this.configs();
    this.createMongo();
    this.connect();
  }

  configs(){
    this.config = config.database.mongodb;
  }

  createMongo(){
    this.mongoose = mongoose;
    this.mongoose.set('useCreateIndex', true);
  }

  connect(){
    let url = `mongodb://${ this.config.hostname }:${ this.config.port }/${ this.config.database }`;
    this.mongoose.connect(url, this.options)
    .then(() => console.log('Database connected'))
    .catch(() => console.log('Connect database fail.'));
  }

  createSchema(schema, collection) {
    return this.mongoose.model(collection, new this.mongoose.Schema(schema));
  }

  close(){
    this.mongoose.connection.close();
  }

}

module.exports = Mongoose;