const cors = require('cors');
const bodyParser = require('body-parser');

const langs = require('../../../modules/language');
const Response = require('../../../modules/response');
const token = require('../../../modules/token');

const UserModel = require('../../../models/user');
const User = new UserModel;

var path = '';
const apiPassAccessToken = [
  'user/register',
  'user/login',
  'user/verify-token',
  'user/forgot-password',
  'user/reset-password'
];

const getApiPass = () => apiPassAccessToken.map(api => `/${ path }/${ api }`);

const middleware_access_token = async (req, res, next) => {
  let url = req.url;
  if (getApiPass().contain(url)){
    next();
    return;
  }

  let access_token = req.headers['access-token'];
  try{
    let decoded = token.verify(access_token);

    if (!decoded || !decoded.username){
      new Response(403, langs.get('error_access_token_not_exists')).withJson(res);
      return;
    }

    let user = await User.findUsername(decoded.username);
    
    if (!user || !user.active){
      User.close();
      new Response(403, langs.get('error_access_token_not_exists')).withJson(res);
      return;
    }

    req.user = user;
    next();
  }
  catch(err){console.log(err);
    new Response(403, langs.get('error_access_token_not_exists')).withJson(res);
  }
}

module.exports = (app, pathname) => {
  path = pathname;
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json());
  app.use(middleware_access_token);
};