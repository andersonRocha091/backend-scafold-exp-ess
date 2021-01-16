const ICrud = require("../interfaces/InterfaceCrud");

class MongoDbDecorator extends ICrud{
  constructor(MongoDB){
    super();
    this.decoratedMongoDb = MongoDB;
  }
  async isConnected() {
    return this.decoratedMongoDb.isConnected()
  }

  static connect() {
   return this.decoratedMongoDb.connect();
  }

  create(item){
    return this.decoratedMongoDb.create(item);
  }
  read(query,skip = 0, limit = 10) {
   return this.decoratedMongoDb.read(query,skip = 0, limit = 10);
  }
  update(id, item) {
    return this.decoratedMongoDb.update(id, item);
  }
  delete(id) {
    return this.decoratedMongoDb.delete(id)
  }
  deleteAll(){
    return this.decoratedMongoDb.deleteAll();
  }
  getSchema(){
    return this.decoratedMongoDb.getSchema();
  }

}

module.exports = MongoDbDecorator;