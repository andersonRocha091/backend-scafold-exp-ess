const assert = require("assert");
const MongoDB = require("../db/strategies/mongodb/MongoDb");
const MongoDecorator = require('../db/strategies/mongodb/MongoDbSpecialFeatures');
const RepositoriesSchema = require("../db/strategies/mongodb/schemas/RepositoriesSchema");
const likesSchema = require("../db/strategies/mongodb/schemas/LikeSchema");
const Context = require("../db/strategies/base/ContextStrategy");
const { stringify } = require("querystring");

let context = {};
let connection = {};
const MOCK_REPO_ADD = {
  title: "awesome repo",
  url: "http://www.google.com.br",
  techs: ["Javascript", "NodeJs", "React"],
  likes: 0,
};
let MOCK_REPO_UPDATE = {
  title: "NodeJS first repo",
  url: "http://www.facebook.com.br",
  techs: ["go","ruby","javascript"],
  likes: 0
}
let upsertedLikeId = "";
describe("MongoDB test suit", function () {
  this.timeout(30000);
  
  this.beforeAll(async () => {
    connection = MongoDB.connect();
    context = new Context(new MongoDB(connection, RepositoriesSchema));
    likesContext = new Context(new MongoDecorator(new MongoDB(connection, likesSchema)));
    const {_id} = await context.create(MOCK_REPO_UPDATE)
    MOCK_REPO_UPDATE = {_id, ...MOCK_REPO_UPDATE};
  });

  this.afterAll(async () => {
    await context.deleteAll();
    await likesContext.deleteAll();
  })

  it("Testing if it was able to connect", async () => {
    const result = await context.isConnected();
    const expected = "Connected";
    assert.deepEqual(result, expected);
  });

  it("Testing inserting an item", async () => {
    const { techs, title, likes, url } = await context.create(
      MOCK_REPO_ADD
    );
    assert.deepEqual({ title, url, techs, likes }, MOCK_REPO_ADD);
  });

  it("Listing an item", async () => {
    const [{ techs, title, likes, url }] = await context.read({
      title: MOCK_REPO_ADD.title
    },0, 10);
    assert.deepEqual({ title, url, techs, likes }, MOCK_REPO_ADD);
  });

  it("it updates a repository", async () => {
    const result = await context.update(MOCK_REPO_UPDATE._id,{title: "ReactJS repo"});
    assert.deepEqual(result.nModified, 1);
  });

  it("create a like for a repository",async () => {
    const result = await likesContext.updateSpecial(MOCK_REPO_UPDATE._id, {userName: `test - ${Date.now()}`});
    let convertedResult = JSON.parse(JSON.stringify(result));
    upsertedLikeId = convertedResult._id;
    assert.equal(convertedResult.repositoryId, MOCK_REPO_UPDATE._id);
  })

  it("insert new like for a repository incrementing only likes and user properties",async () => {
    const result = await likesContext.updateSpecial(MOCK_REPO_UPDATE._id, {userName: `test - ${Date.now()}`});
    assert.equal(result.likes,2);
  })

  it("fails on trying to remove an unexistent like:", async () => {
    const result = await likesContext.delete('6003155cd7262f374a8e2cc0');
    assert.equal(result.deletedCount,0);
  })

  it("deletes successfully a like:", async () => {
    const result = await likesContext.delete(upsertedLikeId);
    assert.equal(result.deletedCount,1);
  })

  it("Removes a repo", async () => {
    const result = await context.delete(MOCK_REPO_UPDATE._id);
    assert.deepEqual(result.deletedCount,1);
  })

});
