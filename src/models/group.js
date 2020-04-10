const Database = require('../modules/database');
const ObjectId = Mongo.getObjectId();

class GroupModel extends Database{

  schema = {
    name : { type: String, required: true },
    parentId : { type: ObjectId, default: new ObjectId(), ref: 'group' },
    createdAt : { type: Date, default: Date.now },
    createdBy : { type: ObjectId, required: true },
    edited : { type: Object, default: {} }
  }

  collection = 'group';

  constructor(){
    super();
  }

  findId(_id){
    return this.findOne({ _id });
  }

  findGroup(credentials, option){
    return this.find(credentials, option.fields, option.options);
  }

}

module.exports = GroupModel;