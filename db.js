const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

module.exports.getAllSignatures = () => {
    const q = `SELECT * FROM signatures`;
    return db.query(q);
};

module.exports.addSignature = (first, last, signature) => {
    const q = `
        INSERT INTO signatures (first, last, signature)
        VALUES ($1, $2, $3)
        RETURNING id
        `;
    const params = [first, last, signature];
    return db.query(q, params);
};

module.exports.selectNames = () => {
    const q = `SELECT first,last FROM signatures`;
    return db.query(q);
};

module.exports.selectNum = () => {
    const q = `SELECT count(id) FROM signatures`;
    return db.query(q);
};

module.exports.urlSignature = (id) => {
    const q = `SELECT * FROM signatures WHERE id = ($1)`;
    const params = [id];
    return db.query(q, params);
};