class Routes{

  app = null;

  pathname = '';

  constructor(app){
    this.app = app;
  }

  setRouter(path, version = ''){
    this.pathname = path + '/' + version;
    return this;
  }

  start(directory){
    require(`../controller/${ directory }`)(this.app, this.pathname);
  }

}

module.exports = Routes;