// var redis = require("redis");
// const { promisify } = require("util");

// var client = redis.createClient({
//     host: "localhost",
//     port: 6379,
// });

// client.on("error", function (err) {
//     console.log(err);
// });

// module.exports.set = promisify(client.set).bind(client);
// module.exports.get = promisify(client.get).bind(client);
// module.exports.setex = promisify(client.setex).bind(client);
// module.exports.del = promisify(client.del).bind(client);

// server.js:
// const redis = require("./redis");

// app.get("/fun.with.redis", (req, res) => {
//     redis
//         .setex(
//             "cat",
//             10,
//             JSON.stringify({
//                 name: "Morrissey",
//                 animal: "cat",
//             })
//         )
//         .then(() => {
//             redis.redirect("/get-from-redis");
//         })
//         .catch((err) => console.log("err in setex: ", err));
// });

// app.get("/get-from-redis", (req, res) => {
//     redis.get("cat").then((data) => {
//         console.log("preparsed data: ", data);
//         console.log("data from redis: ", JSON.parse(data));
//         res.sendStatus(200);
//     });
// });

// ---

// client.set("name", "eileen", (err, data) => {
//     console.log("set 'name' from redis: ", data);
// });

// client.get("name", (err, data) => {
//     console.log("get 'name' from redis: ", data);
// });

// client.del("name", (err, data) => {
//     console.log("delete 'name': ", data);
// });

// client.get("name", (err, data) => {
//     console.log("get 'name' from after deleting from redis: ", data);
// });