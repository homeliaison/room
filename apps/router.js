const Router = function (MONGOC) {
  const Mother = require(`${process.cwd()}/apps/mother.js`);
  this.mother = new Mother();
  this.mongo = MONGOC;
}

Router.prototype.rou_get_First = function () {
  const instance = this;
  let obj = {};
  obj.link = "/";
  obj.func = function (req, res) {
    try {
      res.set({ "Content-Type": "text/plain" });
      res.send("hi");
    } catch (e) {
      console.log(e);
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
