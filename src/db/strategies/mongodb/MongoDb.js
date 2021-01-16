// import ICrud from "../interfaces/InterfaceCrud";
const Mongoose  = require('mongoose');
const ICrud = require('../interfaces/InterfaceCrud');

const STATUS = {
  0: "Disconected",
  1: "Connecting",
  2: "Connected",
  3: "Disconnecting",
};

class MongoDB extends ICrud{
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const state = STATUS[this._connection.readyState];
    if (state === "Connected") return state;
    if (state !== "Connecting") return state;
    return STATUS[this._connection.readyState];
  }

  static connect() {
    console.log(process.env.MONGODB_URL);
    Mongoose.connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      },
      function (error) {
        if (!error) {
          return;
        }
        console.log("Connection failed!", error);
      }
    );
    const connection = Mongoose.connection;
    connection.once("open",()=>{console.log('database running')
      connection.readyState = 2;
  });
    return connection;
  }

  create(item){
    return this._schema.create(item);
  }
  read(query,skip = 0, limit = 10) {
   return this._schema.find(query).skip(skip).limit(10);
  }
  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item },{upsert: true});
  }
  delete(id) {
    return this._schema.deleteOne({ _id: id });
  }
  deleteAll(){
    return this._schema.deleteMany({});
  }
  getSchema(){
    return this._schema;
  }
}

module.exports = MongoDB;
