const express = require('express');
const socketio = require('socket.io');
const http = require('http');

class Server{

  app = null;

  server = null;

  port = process.env.PORT;

  io = null;

  db = '';

  database = null;

  constructor(db){
    this.db = db;
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  createApp(){
    this.app = express();
  }

  config(){
    this.port = process.env.PORT || config.server.port;
  }

  createServer(){
    this.server = http.createServer(this.app);
  }

  sockets(){
    this.io = socketio(this.server);
  }

  listen(){
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });
  }

  getApp(){
    return this.app;
  }

}

module.exports = Server;