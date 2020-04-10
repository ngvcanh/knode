const Response = require('./response');

class Controller{

  model = null;

  token = Token;

  constructor(modelName){
    modelName && (this.model = new modelName);
  }

  responseJson(res, code, message = '', data = null, error = null){
    let params = [ code ];

    params.push(message ? message : undefined);
    params.push(data ? data : undefined);
    params.push(error ? error : undefined);
    
    new Response(...params).withJson(res);
  }

}

module.exports = Controller;