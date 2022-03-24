const Router = function (MONGOC) {
  const Mother = require(`${process.cwd()}/apps/mother.js`);
  this.mother = new Mother();
  this.mongo = MONGOC;
}

Router.prototype.rou_get_First = function () {
  const instance = this;
  const fs = require('fs');
  let obj = {};
  obj.link = "/";
  obj.func = function (req, res) {
    res.set({ "Content-Type": "text/plain" });
    try {
      const stream = fs.createReadStream(process.cwd() + "/data.txt");
      stream.pipe(res);
    } catch (e) {
      console.log(e);
    }
  }
  return obj;
}

Router.prototype.rou_post_generalMongo = function () {
  const instance = this;
  const { equalJson, fileSystem } = this.mother;
  let obj = {};
  obj.link = "/generalMongo";
  obj.func = async function (req, res) {
    res.set({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Accept, X-Requested-With, remember-me",
    });
    try {
      if (req.body.mode === undefined) {
        throw new Error("must be mode => [ create, read, update, delete ]");
      }
      if (req.body.collection === undefined) {
        throw new Error("must be collection name");
      }
      const { mode, collection } = req.body;
      const db = "miro81";
      let selfMongo, result;
      let whereQuery, updateQuery;
      let rows;

      selfMongo = instance.mongo;

      if (mode === "read") {
        if (req.body.whereQuery === undefined) {
          throw new Error("must be whereQuery");
        }
        whereQuery = equalJson(req.body.whereQuery);
        result = await selfMongo.db(db).collection(collection).find(whereQuery).toArray();

      } else if (mode === "update") {
        if (req.body.whereQuery === undefined || req.body.updateQuery === undefined) {
          throw new Error("must be whereQuery and updateQuery");
        }
        whereQuery = equalJson(req.body.whereQuery);
        updateQuery = equalJson(req.body.updateQuery);
        result = await selfMongo.db(db).collection(collection).find(whereQuery).toArray();
        if (result.length !== 0) {
          await selfMongo.db(db).collection(collection).updateOne(whereQuery, { $set: updateQuery });
        }
        result = { message: "done" };

      } else if (mode === "create") {
        if (req.body.updateQuery === undefined) {
          throw new Error("must be updateQuery");
        }
        updateQuery = equalJson(req.body.updateQuery);
        await selfMongo.db(db).collection(collection).insertOne(updateQuery);
        result = { message: "done" };

      } else if (mode === "delete") {
        if (req.body.whereQuery === undefined) {
          throw new Error("must be whereQuery");
        }
        whereQuery = equalJson(req.body.whereQuery);
        await selfMongo.db(db).collection(collection).deleteOne(whereQuery);
        result = { message: "done" };

      } else {
        throw new Error("must be mode => [ create, read, update, delete ]");
      }

      res.send(JSON.stringify(result));
    } catch (e) {
      res.send({ message: e.message });
    }
  }
  return obj;
}

Router.prototype.getAll = function () {
  let result, result_arr;

  result = { get: [], post: [] };
  result_arr = Object.keys(Router.prototype);

  for (let i of result_arr) { if (/^rou_get/g.test(i)) {
    result.get.push((this[i])());
  }}

  for (let i of result_arr) { if (/^rou_post/g.test(i)) {
    result.post.push((this[i])());
  }}

  return result;
}

module.exports = Router;
