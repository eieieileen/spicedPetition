//when we have secrets
// let db;
// if (process.send.DATABASE_URL) {
//     //running in production
//     db = spicedPg(process.env.DATABASE_URL);
// } else {
//     const { dbuser, dbpass } = require("../secrets.json");
//     db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/petition`)
// }

const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

module.exports.getAllSignatures = () => {
    const q = `SELECT * FROM signatures`;
    return db.query(q);
};

module.exports.addSignature = (signature, user_id) => {
    const q = `
        INSERT INTO signatures (signature, user_id)
        VALUES ($1, $2)
        RETURNING user_id
        `;
    const params = [signature, user_id];
    return db.query(q, params);
};

module.exports.selectNames = () => {
    const q = `SELECT first_name,last_name,id FROM users`;
    return db.query(q);
};

module.exports.selectNum = () => {
    const q = `SELECT count(id) FROM signatures`;
    return db.query(q);
};

module.exports.urlSignature = (id) => {
    const q = `SELECT * FROM signatures WHERE user_id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.addUser = (first_name, last_name, password_hash, email) => {
    const q = `
        INSERT INTO users (first_name, last_name, password_hash, email)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `;
    const params = [first_name, last_name, password_hash, email];
    return db.query(q, params);
};

module.exports.checkPassword = (email) => {
    const q = `SELECT password_hash,id FROM users WHERE email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.profilePage = (age, city, url, user_id) => {
    //maybe also insert user_id as a parameter
    const q = `INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, LOWER($2), $3, $4)
    RETURNING user_id`;
    const params = [age, city, url, user_id];
    return db.query(q, params);
};

module.exports.getProfile = () => {
    const q = `SELECT users.first_name,users.last_name,user_profiles.age,user_profiles.city,user_profiles.url,signatures.user_id 
    FROM users 
    INNER JOIN user_profiles 
    ON users.id = user_profiles.user_id 
    INNER JOIN signatures
    ON users.id = signatures.user_id
`; //omg
    return db.query(q);
};

module.exports.getCity = (city) => {
    const q = `SELECT users.first_name,users.last_name,user_profiles.age,user_profiles.url
    FROM users
    JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE user_profiles.city = ($1)`;
    const params = [city];
    return db.query(q, params);
};

module.exports.editProfile = (id) => {
    const q = `SELECT users.first_name, users.last_name, users.email, user_profiles.age, user_profiles.city, user_profiles.url
    FROM users
    JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE users.id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.updateUsersWithPassword = (
    first_name,
    last_name,
    email,
    password,
    id
) => {
    const q = `UPDATE users
    SET first_name = ($1), last_name = ($2), email = ($3), password_hash = ($4)
    WHERE id = ($5)`;
    const params = [first_name, last_name, email, password, id];
    return db.query(q, params);
};

module.exports.profileUpdate = (age, city, url, user_id) => {
    const q = `INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age=($1), city=($2), url=($3), user_id=($4)`;
    const params = [age, city, url, user_id];
    return db.query(q, params);
};

module.exports.updateUsersNoPassword = (
    first_name,
    last_name,
    email,
    id
) => {
    const q = `UPDATE users
    SET first_name = ($1), last_name = ($2), email = ($3)
    WHERE id = ($4)`;
    const params = [first_name, last_name, email, id];
    return db.query(q, params);
};

module.exports.deleteSignature = (id) => {
    const q = `DELETE FROM signatures WHERE user_id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

// module.exports.deleteUsers = (first_name, last_name, password_hash, email) => {
//     const q = `DELETE FROM users WHERE user_id = ($1)`;
//     const params = [first_name, last_name, password_hash, email];
//     return db.query(q, params);
// };

// module.exports.deleteUser_profiles = 


// module.exports.urlSignature = (id) => {
//     const q = `SELECT * FROM signatures WHERE user_id = ($1)`;
//     const params = [id];
//     return db.query(q, params);
// };

// DELETE FROM actors WHERE id = 7;