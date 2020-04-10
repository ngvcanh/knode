class Language{

  current = config.language.default;

  languages = {};

  constructor(){
    this.languages = require(`../languages/${ this.current }`);
  }

  get(key){
    return key in this.languages ? this.languages[key] : '';
  }

}

module.exports = new Language;