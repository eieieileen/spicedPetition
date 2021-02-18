const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bcrypt.js");


app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use((req, res, next) => {
    console.log(`MIDDLEWARE LOG: ${req.method} to ${req.url} route`);
    next();
});

//homepage
app.get("/petition", (req, res) => {
    // const { canvas } = req.body;
    // console.log("req body canvas: ", req.body);
    if (!req.session.signature) {
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
    //console.log("req body", req.body);
    const { signature } = req.body;
    db.addSignature(signature)
        .then(({ rows }) => {
            req.session.signature = rows[0].id; //signature id opgeslagen THIS IS HOW IK MIJN COOKIE ZET

            //res.cookie("signed", "true");
            res.redirect("/thanks");
        })
        .catch((err) => {
            console.log("error in app.post/petition 💃", err);
            res.render("petition", {
                err: true, //ik wil hier dus de partial
            });
        });
});

//after signing petition
app.get("/thanks", (req, res) => {
    if (req.session.signature) {
        db.selectNum()
            .then(({ rows }) => {
                const count = rows[0].count;
                db.urlSignature(req.session.signature)
                    .then(({ rows }) => {
                        const img = rows[0].signature;
                        res.render("thanks", {
                            layout: "main",
                            count: count,
                            img: img,
                        });
                    })
                    .catch((err) => console.log("error in urlSignature", err));
                // console.log("response van selectNum", rows);
            })
            .catch((err) => console.log("error in selectNum", err));

        //db query heb ik nog niet, ik wil een plaatje van de signature dus moet weten welke het is dus moet uit de database de signature halen selectsignature
    } else {
        res.redirect("/petition");
    }
});

// app.post("/register", req res) {
//     const {firstName, password, email} = req.body;

//     if (!firstName || !password || !lastname) {
//         res.render(register", error:true, errorMessage:"please prove a first name"
//     }

app.get("/register", (req, res) => {
    // console.log("req body", req.body);

    if (!req.session.loggedIn) {
        res.render("register", {
            layout: "main",
        });
    } else {
        res.redirect("/petition");
    }
});

app.get("/login", (req, res) => {
    if (!req.session.loggedIn) {
        res.render("login", {
            layout: "main",
        });
    } else {
        res.redirect("/petition");
    }
});

app.post("/register", (req, res) => {
    const { password, email, firstName, lastName } = req.body;
    hash(password).then((hashedPassword) => {
        // Do what you need to do
    });
});

app.post("/login", (req, res) => {

});

//signers page with names
app.get("/signers", (req, res) => {
    if (!req.session.signature) {
        res.redirect("/petition");
    } else {
        db.selectNames()
            .then(({ rows }) => {
                res.render("signers", {
                    layout: "main",
                    names: rows,
                });
            })
            .catch((err) => {
                console.log("error in /signers sad baby face 👶", err);
            });
    }
});

app.listen(8080, () =>
    console.log("✨ dont panic my queen, you got this!! ✨")
);
