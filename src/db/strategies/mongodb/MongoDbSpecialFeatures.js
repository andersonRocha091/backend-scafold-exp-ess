const MongoDbDecorator = require('./MongoDbDecorator');

class MongoDbSpecialFeatures extends MongoDbDecorator{
  constructor(MongoDB){
    super(MongoDB);
  }
  async isConnected() {
   return super.isConnected()
  }

  static connect() {
   return super.connect();
  }

  create(item){
    return super.create(item);
  }
  read(query,skip = 0, limit = 10) {
   return super.read(query,skip = 0, limit = 10);
  }
  update(id, item) {
    return super.update(id, item);
  }
  updateSpecial(id,item){
    return super
      .getSchema()
      .findOneAndUpdate(
        { repositoryId: id },
        {
          $set: { repositoryId: id },
          $inc: { likes: 1 },
          $push: { users: item.userName },
        },
        { upsert: true, new: true }
      );
    
    // .updateOne(
    //   { repositoryId: id },
    //   { $set:{repositoryId: id}, $inc: { likes: 1 }, $push: { users: item.userName } },
    //   { upsert: true }
    // );
  }
  delete(id) {
    return super.delete(id);
  }
  deleteAll(){
    return super.deleteAll({});
  }
}

module.exports = MongoDbSpecialFeatures