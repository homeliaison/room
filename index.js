const Index = function () {
  const Mother = require(`${process.cwd()}/apps/mother.js`);
  this.mother = new Mother();
}

Index.prototype.main = async function () {
  const instance = this;
  const PORT = 3000;
  const http = require("http");
  const express = require("express");
  const { MongoClient } = require("mongodb");
  const app = express();
  const mongolocalinfo = "mongodb://127.0.0.1:27017";
  const MONGOLOCALC = new MongoClient(mongolocalinfo, { useUnifiedTopology: true });
  try {

    app.use(express.json({ limit : "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));

    await MONGOLOCALC.connect();

    const Router = require(`${process.cwd()}/apps/router.js`);
    const router = new Router(MONGOLOCALC);

    const rouObj = router.getAll();
    for (let obj of rouObj.get) {
      app.get(obj.link, obj.func);
    }
    for (let obj of rouObj.post) {
      app.post(obj.link, obj.func);
    }

    http.createServer(app).listen(PORT, () => { console.log(`\x1b[33m%s\x1b[0m`, `\nServer running\n`); });

    console.log("connect");

  } catch (e) {
    console.log(e);
  }
}

const app = new Index();
app.main();
