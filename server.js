const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bcrypt.js");
const { setRandomFallback } = require("bcryptjs");

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

app.get("/", (req, res) => {
    res.redirect("/register");
});

//homepage
app.get("/petition", (req, res) => {
    if (!req.session.signature && req.session.loggedIn) {
        res.render("petition", {
            layout: "main",
        });
    } else if (req.session.signature && req.session.loggedIn) {
        res.redirect("/thanks");
    } else {
        res.redirect("/login");
    }
    // } else {
    //     console.log("cookies accepted yaaay!");
    //     res.redirect("/register");
    // }
});

//post homepage
app.post("/petition", (req, res) => {
    console.log("req sessuib", req.session.loggedIn);
    const { signature } = req.body;
    db.addSignature(signature, req.session.loggedIn)
        .then(({ rows }) => {
            req.session.signature = rows[0].user_id; //signature id opgeslagen THIS IS HOW IK MIJN COOKIE ZET
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
                console.log("response van selectNum", rows);
            })
            .catch((err) => console.log("error in selectNum", err));

        //db query heb ik nog niet, ik wil een plaatje van de signature dus moet weten welke het is dus moet uit de database de signature halen selectsignature
    } else {
        res.redirect("/petition");
    }
});

app.get("/register", (req, res) => {
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

//catch in posts with errors

app.post("/register", (req, res) => {
    //validate user input:
    const { password, email, firstName, lastName } = req.body;
    hash(password)
        .then((hashedPassword) => {
            db.addUser(firstName, lastName, hashedPassword, email)
                .then(({ rows }) => {
                    req.session.loggedIn = rows[0].id;
                    res.redirect("/profile");
                })
                .catch((err) => {
                    console.log("error in post /register 🥵", err);
                    res.render("register", {
                        err: true,
                    });
                });
        })
        .catch((err) => {
            console.log("err hashing pw: ", err);
        });

    //db quera maken wwaar ik first name last name password invoer en email e
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.checkPassword(email)
        .then(({ rows }) => {
            const id = rows[0].id;
            compare(password, rows[0].password_hash).then((match) => {
                db.urlSignature(id)
                    .then(({ rows }) => {
                        if (rows[0].user_id) {
                            if (match == true) {
                                req.session.signature = rows[0].user_id;
                                req.session.loggedIn = id;
                                res.redirect("/petition");
                            } else {
                                res.render("login", {
                                    err: true,
                                });
                            }
                            console.log("match", match);
                        } else {
                            req.session.loggedIn = id;
                            res.redirect("/thanks");
                        }
                    })
                    .catch((err) =>
                        console.log("error in db.urlSignature 👩‍🦰", err)
                    );
            });
            console.log("response from checkPW", { rows });
        })
        .catch((err) => {
            console.log("error in checkPassword🤬", err);
            res.render("login", {
                err: true,
            });
        });
});



//signers page with names
app.get("/signers", (req, res) => {
    if (!req.session.signature) {
        res.redirect("/petition");
    } else {
        db.getProfile()
            .then(({ rows }) => {
                const profile = rows;
                console.log("rows", rows);
                res.render("signers", {
                    layout: "main",
                    profile: profile,
                });
            })
            .catch((err) => console.log("err in db.getProfile 📛", err));
    }
});

app.get("/signers/*", (req, res) => {
    console.log("req.params", req.params[0]);
    db.getCity(req.params[0]).then(({rows}) => {
        res.render("signers", {
            layout: "main",
            profile: rows
        });
    }).catch((err) => console.log("error in getCity🆙", err));
});

app.get("/profile", (req, res) => {
    if (req.session.loggedIn) {
        res.render("profile", {
            layout: "main",
        });
    } else {
        res.redirect("/login");
    }
});

app.post("/profile", (req, res) => {
    const { age, city, url } = req.body;
    let newUrl = url;

    if (!url.startsWith("http://") || !url.startsWith("https://")) {
        newUrl = "http://" + url;
    }

    db.profilePage(age, city, newUrl, req.session.loggedIn)
        .then(() => {
            res.redirect("/petition");
        })
        .catch((err) => console.log("error in /profile 🐝", err));
});

app.get("/logout", (req, res) => {
    console.log("I am logged out whieeeeh");
    //cookies resetten en redirecten naar register
    // req.logout();
    req.session = null;
    res.redirect("register");
});

app.listen(process.env.PORT || 8080, () =>
    console.log("✨ dont panic my queen, you got this!! ✨")
);
