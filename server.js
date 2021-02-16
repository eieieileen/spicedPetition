const express = require("express");
const app = express();
const db = require("./db");

//console.log("db sanity: ", db);

db.getAllActors().then(({ rows }) => {
    console.log("rows :", rows);
}).catch((err) => console.log("error in db.getAllActors 🙅‍♀️", err));

db.addActor("Emma Watson", "30", 0).then(({ rows }) => {
    console.log("rows with Emma: ", rows);
}).catch((err) => console.log("error in db.addActor :(", err));

app.listen(8080, () => console.log("✨ dont panic my queen, you got this!! ✨"));