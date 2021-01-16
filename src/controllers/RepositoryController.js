const MongoDB = require("../db/strategies/mongodb/MongoDb");
const Context = require("../db/strategies/base/ContextStrategy");
const RepositoriesSchema = require("../db/strategies/mongodb/schemas/RepositoriesSchema");

class RepositoryController {
  constructor(connection) {
    this.name = "Anderson";
    this._db = new Context(new MongoDB(connection, RepositoriesSchema));
  }

  addRepository = async (req, res) => {
    try {
      const { _id, title, url, techs, likes } = await this._db.create(req.body);
      return res.status(200).json({ id: _id, title, url, techs, likes });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  listRepositories = async (req, res) => {
    try {
      const result = await this._db.read({});
      return res.status(200).json({ result });
    } catch (error) {
      console.log("ERROR: ", error);
      return res.status(500).json({ message: error.message });
    }
  };

  updateRepository = async (req, res) => {
    try {
      const { id } = req.params;
      const updateObj = Object.assign({}, req.body);
      if (updateObj.likes) delete updateObj.likes;
      const result = await this._db.update(id, updateObj);
      return res.status(200).json({ result });
    } catch (error) {
      console.log("ERROR: ", error);
      return res.status(500).json({ message: error.message });
    }
  };

  deleteRepository = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this._db.delete(id);
      return res.status(200).json({result});
    } catch (error) {
      console.log('Error: ',error)
      res.status(500).message({message: error.message});
    }
  };
}

module.exports = RepositoryController;
