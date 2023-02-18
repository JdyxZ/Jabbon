-- CREATE USER
CREATE USER IF NOT EXISTS 'Haylo'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
CREATE USER IF NOT EXISTS 'Jabbon'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Cacahuete200$';

GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'Haylo'@'localhost' WITH GRANT OPTION;
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'Jabbon'@'localhost' WITH GRANT OPTION;

FLUSH PRIVILEGES;

SELECT * FROM mysql.USER;

-- DROP USER IF EXISTS 'mysql'@'localhost';

-- CREATE DATABASE

CREATE DATABASE IF NOT EXISTS JabbonDB;

USE JabbonDB;

CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    avatar VARCHAR(255),
    room_name VARCHAR(255),
    position INT,

    PRIMARY KEY (user_id)
);

-- DROP DATABASE IF EXISTS Jabbon;

-- INSERTS

USE JabbonDB;

INSERT INTO users (user_id, name, password, avatar, room_name, position)
VALUES (0, "javi", "Cacahuete", "2", "hola", 40);

INSERT INTO users (user_id, name, password, avatar, room_name, position)
VALUES (0, "eric", "Avocado", "4", "foo", 40);

-- QUERIES
USE JabbonDB;

TABLE users;
