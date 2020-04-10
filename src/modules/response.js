const response = require('../response');

class Response{
  
  code = 404;

  response = {}

  constructor(code, message = '', data = null, error = null) {
    code = code in response ? code : this.code;
    let result = JSON.parse(JSON.stringify(response[code]));

    !!message && (result.message = message);
    !!data && (result.data = data);
    !!error && (result.error = error);

    result.lang = config.language.default;
    this.response = result;
  }

  withJson(res){
    res.send(this.response).status(200);
  }
}

module.exports = Response;