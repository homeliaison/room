const Index = function () {
  const Mother = require(`${process.cwd()}/apps/mother.js`);
  this.mother = new Mother();
}

Index.prototype.frontRender = async function () {
  const instance = this;
  const { fileSystem } = this.mother;
  try {
    const generalString = await fileSystem("readString", [ `${process.cwd()}/front/general.js` ]);
    const targets = (await fileSystem("readDir", [ `${process.cwd()}/front` ])).filter((str) => {
      return ![ ".DS_Store", "general.js", "dist" ].includes(str);
    }).map((str) => { return `${process.cwd()}/front/${str}` });
    let localString, jsString, html;
    let fileName;

    for (let filePath of targets) {
      localString = await fileSystem("readString", [ filePath ]);
      jsString = generalString + "\n\n" + localString
      fileName = filePath.split("/")[filePath.split("/").length - 1].replace(/\.js$/i, '');

      html = `<!DOCTYPE html>
      <html lang="ko" dir="ltr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no,user-scalable=no">
          <style>
            html{-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing: grayscale;-ms-touch-action: manipulation;touch-action: manipulation;}
            *{margin:0;padding:0;transition:all 0.3s ease;font-family:'sandoll';-webkit-tap-highlight-color: transparent;}
            *::-webkit-scrollbar{display:none;}
            body{transition:all 0s ease;}
            body,div{font-size:0;margin:0;}
            a{text-decoration:inherit;color:inherit;-webkit-tap-highlight-color:rgba(0,0,0,0);background:0 0;outline:0}
            textarea{resize:none}
            b,strong{font-weight:inherit;display:inline;}
            img{border:0}
            button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}
            button,html input[type=button],input[type=submit]{-webkit-appearance:button;cursor:pointer;box-sizing:border-box;white-space: normal}
            input[type=text],input[type=password],textarea{-webkit-appearance:none;appearance: none;box-sizing:border-box;}
            input{line-height:normal}
            input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}
            input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}
            input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}
            p{overflow:hidden;}
            label{cursor:pointer}
            article,section{margin:0;}
          </style>
          <title></title>
        </head>
        <body>
          <script>
            ${jsString}
          </script>
        </body>
      </html>`;

      await fileSystem("write", [ `${process.cwd()}/front/dist/${fileName}.html`, html ]);
    }

  } catch (e) {
    console.log(e);
  }
}

Index.prototype.connect = async function () {
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

    await this.frontRender();

    http.createServer(app).listen(PORT, () => { console.log(`\x1b[33m%s\x1b[0m`, `\nServer running\n`); });

  } catch (e) {
    console.log(e);
  }
}

const app = new Index();
app.connect();
