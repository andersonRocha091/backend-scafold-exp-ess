const express = require("express");
const bodyParser = require('body-parser');
const { config } = require("dotenv");
const { join } = require('path');
const { ok } = require('assert');
const env = process.env.NODE_ENV || "dev";

const MongoDB = require('./db/strategies/mongodb/MongoDb.js');

const Router = require('./routes');

class Server{
  constructor(){
    ok(
      env === "prod" || env === "dev",
      "env is invalid, it must be production, or dev"
    );
    
    const configPath = join(__dirname, "./config", `.env.${env}`);
    config({
      path: configPath,
    });

    this.app = express();
    this._router = this.bootstrap(Router);    
    this.server();
  }
  bootstrap(Router){
    const connection = MongoDB.connect();
    return new Router(connection);
  }
  server(){
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}))
    this.app.use('/api', this._router.getRouter());
    this.app.listen(3333);
    console.log('Server listening at 3333')
  }
  getApplication(){
    return this.app;
  }
}

module.exports = Server;