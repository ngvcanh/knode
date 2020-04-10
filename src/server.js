// Require config application
require('./config');

// Require initalize function for defined object
require('./init');

// Create application Server with express, socket.io
const Server = require('./modules/server');
const server = new Server();

// Get application on server
const app = server.getApp();

// Render router object
const Routes = require('./modules/routes');

// Start router API
new Routes(app)
.setRouter(config.api.pathname, config.api.version)
.start(config.api.directory);