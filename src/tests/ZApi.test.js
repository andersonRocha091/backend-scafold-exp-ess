const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const Server = require("../server");
var app = new Server();
app = app.getApplication();

chai.use(chaiHttp);
chai.should();

let MOCK_REPO_CREATE = {
  title: "NodeJS first repo",
  url: "http://www.facebook.com.br",
  techs: ["go", "ruby", "javascript"],
  likes: 0,
};

const nonExistentRepoId = '5fff7b1ffb7e3323af3ea2df';

let MOCK_REPO_UPDATE = {
  title: "ReactJS",
  url: "http://www.instagram.com",
  tech: ["elixir", "typescript"],
  likes: 0,
};
let MOCK_REPO_DELETE = {
  title: "Vue",
  url: "http://www.udemy.com",
  tech: ["ruby", "go"],
  likes: 0,
};
let idUpdate = "";
let idDelete = "";
describe("Test api routes", function () {
  this.beforeAll(async () => {
    idUpdate = await new Promise((resolve, reject)=>{
      chai
      .request(app)
      .post("/api/repositories")
      .type("json")
      .send(MOCK_REPO_UPDATE)
      .end(function (err, res) {
        resolve(res.body.id);
      });
    })
    idDelete = await new Promise((resolve,reject) => {
      chai
        .request(app)
        .post("/api/repositories")
        .type("json")
        .send(MOCK_REPO_DELETE)
        .end(function(err, res){
          resolve(res.body.id)
        })
    })
  });
  describe("/api/repositories", function () {
    it("should be able to create a new repository", () => {
      chai
        .request(app)
        .post("/api/repositories")
        .type("json")
        .send(MOCK_REPO_CREATE)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.id).to.be.not.null;
        });
    });
    it('should be able to give a like to a repository', function () {
      chai
        .request(app)
        .post(`/api/repositories/${idUpdate}/like`)
        .type("json")
        .send({userName: `teste-${Date.now()}`})
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.repositoryId).to.be.equal(idUpdate);
        });
    });
    it('shouldnt be able to give a like to a  unexistent repository', function () {
      chai
        .request(app)
        .post(`/api/repositories/60035d4880fe10a1da868601/like`)
        .type("json")
        .send({userName: `teste-${Date.now()}`})
        .end(function (err, res) {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal('No repo found!');
        });
    });
    it("shouldnt be able to create a new repository without title", () => {
      const { url, techs, likes } = MOCK_REPO_CREATE;
      chai
        .request(app)
        .post("/api/repositories")
        .type("json")
        .send({ url, techs, likes })
        .end(function (err, res) {
          expect(res).to.have.status(500);
        });
    });
    it("should be able to list the repositories", () => {
      chai
        .request(app)
        .get("/api/repositories")
        .end(function (err, res) {
          expect(res).to.have.status(200);
        });
    });
    it("should be able to update an repository", () => {
      chai
        .request(app)
        .put(`/api/repositories/${idUpdate}`)
        .type("json")
        .send({
          title: "React Native",
          techs: ["React"],
          url: "http://www.flogao.com.br",
        })
        .end(function (err, res) {
          const {result:{nModified}} = res.body;
          expect(res).to.have.status(200);
          expect(nModified).to.be.equal(1);
        });
    });
    it('shouldnt be able to update a non-existent repository', () => {
      chai
        .request(app)
        .put(`/api/repositories/${nonExistentRepoId}`)
        .type("json")
        .send({
          title: "React Native",
          techs: ["React"],
          url: "http://www.flogao.com.br",
        })
        .end(function (err, res) {
          const {result:{nModified}} = res.body;
          expect(res).to.have.status(200);
          expect(nModified).to.be.equal(0);
        });
    })
    it('should be able to delete a repository', () => {
      chai
        .request(app)
        .delete(`/api/repositories/${idDelete}`)
        .end(function (err, res) {
          const {result:{deletedCount}} = res.body;
          expect(res).to.have.status(200);
          expect(deletedCount).to.be.greaterThan(0);
        })
    });
    it('shouldnt be able to delete a non-existent repository', () => {
      chai
        .request(app)
        .delete(`/api/repositories/${nonExistentRepoId}`)
        .end(function (err, res) {
          const {result:{deletedCount}} = res.body;
          expect(res).to.have.status(200);
          expect(deletedCount).to.be.equals(0);
        })
    });
  });
});
