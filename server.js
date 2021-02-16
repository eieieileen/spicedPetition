const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const cookieParser = require("cookie-parser");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));

app.use((req, res, next) => {
    console.log(`MIDDLEWARE LOG: ${req.method} to ${req.url} route`);
    next();
});

//homepage
app.get("/petition", (req, res) => {
    // const { canvas } = req.body;
    // console.log("req body canvas: ", req.body);
    if (!req.cookies.signed) {
        res.render("petition", {
            layout: "main",
        });
    } else {
        console.log("cookies accepted yaaay!");
        res.redirect("/thanks");
    }
});

//post homepage
app.post("/petition", (req, res) => {
    console.log("req body", req.body);
    const { firstName, lastName, signature } = req.body;
    db.addSignature(firstName, lastName, signature)
        .then(() => {
            res.cookie("signed", "true");
            res.redirect("/thanks");
        })
        .catch((err) => {
            console.log("error in app.post/petition 💃", err);
            res.render("petition", {
                err: true //ik wil hier dus de partial
            });
        });
});

//after signing petition
app.get("/thanks", (req, res) => {
    if (req.cookies.authenticated) {
        res.render("thanks", {
            layout: "main",
        });
    } else {
        res.redirect("/petition");
    }
});

app.listen(8080, () =>
    console.log("✨ dont panic my queen, you got this!! ✨")
);
//console.log("db sanity: ", db);

// db.getAllActors().then(({ rows }) => {
//     console.log("rows :", rows);
// }).catch((err) => console.log("error in db.getAllActors 🙅‍♀️", err));

// db.addActor("Emma Watson", "30", 0).then(({ rows }) => {
//     console.log("rows with Emma: ", rows);
// }).catch((err) => console.log("error in db.addActor :(", err));
