const jwt = require('jsonwebtoken');

class Token{

  blacklist = [];

  secret = '';

  constructor(){
    this.secret = config.user.registration.secretAccessToken;
  }

  isValidity(token){
    return !this.blacklist.contain(token);
  }

  deny(token){
    this.blacklist.push(token);
    return this;
  }

  destroyBlacklist(){
    this.blacklist = [];
    return this;
  }

  removeBlacklist(token){
    if (this.blacklist.contain(token)){
      let pos = this.blacklist.indexOf(token);
      this.blacklist.splice(pos, 1);
    }

    return this;
  }

  decode(token){
    let decoded = null;

    try{
      decoded = jwt.verify(token, this.secret);
      decoded = decoded.data;
    }
    catch(err){
      decoded = null;
    }

    return decoded;
  }

  verify(token){
    if (!this.isValidity(token)) return null;
    return this.decode(token);
  }

  generate(data){
    let params = { data, time: new Date().getTime() };
    return jwt.sign(params, this.secret);
  }


  
}

var token = null;
const init = () => token || (token = new Token);

module.exports = init();