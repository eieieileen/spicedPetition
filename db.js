const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

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
    VALUES ($1, $2, $3, $4)
    RETURNING user_id`;
    const params = [age, city, url, user_id];
    return db.query(q, params);
};

module.exports.getProfile = (id) => {
    const q = `SELECT users.first_name,users.last_name,user_profiles.age,user_profiles.city,user_profiles.url,signatures.user_id 
    FROM users 
    INNER JOIN user_profiles 
    ON users.id = user_profiles.user_id 
    WHERE users.id = $1 
    AND LOWER(user_profiles.city) = LOWER($2);
`; //omg
    const params = [id];
    return db.query(q, params);
};


//functie in db die iets gaat invoeren in de database aka sql
