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
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    position INT,
    avatar VARCHAR(255),
    room VARCHAR(255),

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS rooms (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    background VARCHAR(255),
    exits JSON,
    people JSON,
    range_left INT,
    range_right INT,

    PRIMARY KEY (id)
);

-- DROP DATABASE IF EXISTS JabbonDB;

-- INSERTS

USE JabbonDB;

INSERT INTO users (name, password, position, avatar, room)
VALUES ('javi', 'Cacahuete', 40, '2', 'Camping');

INSERT INTO users (name, password, position, avatar, room)
VALUES ('eric', 'Avocado', 40, '4', 'Camping');

INSERT INTO rooms (name, background, exits, people, range_left, range_right)
VALUES ('Camping', './public/media/images/background.png', '{"exit1": -100, "exit2" : 100}', '{"user1": 0, "user2": 1}', -100, 100);

USE JabbonDB;

INSERT into users (id, name, position, avatar, room)
VALUES (1, 'Haylo', 30, '1', 'Hall'), (2, 'Sr.OjeteSucio', 30, '2', 'Hall')
ON DUPLICATE KEY UPDATE name = VALUES(name), position = VALUES(position), avatar = VALUES(avatar), room = VALUES(room);

-- QUERIES
USE JabbonDB;

TABLE users;

TABLE rooms;
