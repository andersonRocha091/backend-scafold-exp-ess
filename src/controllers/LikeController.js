const MongoDB = require("../db/strategies/mongodb/MongoDb");
const MongoDecorator = require("../db/strategies/mongodb/MongoDbSpecialFeatures");
const Context = require("../db/strategies/base/ContextStrategy");
const LikesSchema = require("../db/strategies/mongodb/schemas/LikeSchema");
const RepositoriesSchema = require("../db/strategies/mongodb/schemas/RepositoriesSchema");

class LikeController{
  constructor(connection){
    this._db = new Context(new MongoDecorator(new MongoDB(connection, LikesSchema)));
    this._repoDb = new Context(new MongoDB(connection, RepositoriesSchema));
  }

  addLike = async (req, res) => {
    try {
      const { id } = req.params;
      const { userName } = req.body;
      const result = await this._repoDb.read({
        _id: id
      },0, 10);
      if (result.length === 0 ) return res.status(404).json({message: 'No repo found!'});
      if (!userName) return res.status(400).json({message: 'Bad Request!'});
      
      let resultGiveLike = await this._db.updateSpecial(id,{userName});
      resultGiveLike = JSON.parse(JSON.stringify(resultGiveLike));
      delete resultGiveLike._id;
      delete resultGiveLike._v;
      return res.status(200).json(resultGiveLike);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}
module.exports = LikeController;