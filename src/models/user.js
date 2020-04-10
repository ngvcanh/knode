const bcrypt = require('bcrypt');
const Database = require('../modules/database');

class UserModel extends Database{

  schema = {
    username : { type: String, required: true, unique: true },
    password : { type: String, required: true },
    firstname : { type: String, default: '' },
    lastname : { type: String, default: ''},
    phone : { type: String, required: true, unique: true },
    email : { type: String, required: true, unique: true },
    createdAt : { type: Date, default: Date.now },
    active : { type: Boolean, default: false }
  }

  collection = 'user';

  constructor(){
    super();
  }

  findUsername(username){
    return this.findOne({ username });
  }

  findEmail(email){
    return this.findOne({ email });
  }

  findPhone(phone){
    return this.findOne({ phone });
  }

  findById(_id){
    return this.findOne({ _id });
  }

  hashPassword(password){
    let salt = bcrypt.genSaltSync(config.user.registration.saltRoundsPassword);
    return bcrypt.hashSync(password, salt);
  }

  comparePassword(password, hash){
    return bcrypt.compareSync(password, hash);
  }

  enabledVerify(){
    return true === config.user.registration.enableVerification;
  }

}

module.exports = UserModel;