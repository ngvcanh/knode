const UserController = require('./user');
const GroupController = require('./group');

const middleware = require('./middleware');

const routes = {

  get : [
    
  ],

  post : [
    [ 'user/register', UserController.register ],
    [ 'user/login', UserController.login ],
    [ 'user/verify-token', UserController.verifyToken ],
    [ 'user/forgot-password', UserController.forgotPassword ],
    [ 'user/reset-password', UserController.resetPassword ],
    [ 'user/update', UserController.update ],

    [ 'group/create', GroupController.create ],
    [ 'group/get', GroupController.get ],
    [ 'group/delete', GroupController.deleteGroup ],
    [ 'group/update', GroupController.update ]
  ]

};

module.exports = (app, pathname) => {
  middleware(app, pathname);

  Object.keys(routes).map(method => {
    routes[method].map(route => {
      route[0] = `/${ pathname }/${ route[0] }`;
      app[method]( ...route );
    });
  });
}