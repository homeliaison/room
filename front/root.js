const RootJs = function () {
  this.ea = "px";
}

RootJs.prototype.launching = async function () {
  const instance = this;
  const { ea } = this;
  const { createNode } = GeneralJs;
  try {

    createNode({
      mother: document.body,
      text: "It works!",
      style: {
        fontSize: String(16) + ea,
      }
    })

    console.log("It works!");

  } catch (e) {
    console.log(e);
  }
}

const app = new RootJs();
app.launching().catch((err) => { console.log(err); });
