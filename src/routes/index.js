const express = require('express');
const router = express.Router();

const RepositoryController = require('../controllers/RepositoryController');
const LikeController = require('../controllers/LikeController');

class Router{
  constructor(connection){
    this._router = router;
    this._repositoryController = new RepositoryController(connection);
    this._likeController = new LikeController(connection);
    this.initRoutes();
  }
  initRoutes(){
    this._router.post('/repositories',  this._repositoryController.addRepository);
    this._router.get('/repositories',  this._repositoryController.listRepositories);
    this._router.put('/repositories/:id',  this._repositoryController.updateRepository);
    this._router.delete('/repositories/:id',  this._repositoryController.deleteRepository);

    this._router.post('/repositories/:id/like', this._likeController.addLike);
  }
  getRouter(){
    return this._router;
  }
}


module.exports = Router