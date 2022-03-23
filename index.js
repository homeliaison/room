const Index = function () {
  const Mother = require(`${process.cwd()}/apps/mother.js`);
  this.mother = new Mother();
}

Index.prototype.main = async function () {
  const instance = this;
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

    http.createServer(app);

    console.log("connect");

  } catch (e) {
    console.log(e);
  }
}

const app = new Index();
app.main();
