DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    first_name    VARCHAR NOT NULL CHECK (first_name <> ''),
    last_name     VARCHAR NOT NULL CHECK (last_name <> ''),
    email         VARCHAR NOT NULL UNIQUE CHECK (email <> ''),
    password_hash VARCHAR NOT NULL CHECK (password_hash <> ''),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    signature TEXT NOT NULL CHECK (signature != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles(
id SERIAL PRIMARY KEY,
age VARCHAR(2), 
city VARCHAR(100),
url VARCHAR(300),
user_id INT REFERENCES users(id) NOT NULL UNIQUE);


-- you'll need to use a type of JOIN to retrieve the 
-- user's first & last name, 
-- email from the users table AND age, 
-- city, and url (if available) from the user_profiles table

-- INSERT INTO actors (name, age, oscars)
-- VALUES ('Ingrid Bergman', 67, 4)
-- ON CONFLICT  (name) // unique value
-- DO UPDATE SET age=67, oscars=4;