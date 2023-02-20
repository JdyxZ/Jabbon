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
    room INT,

    PRIMARY KEY (id)
);

USE JabbonDB;

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

-- QUERIES

USE JabbonDB;

INSERT INTO users (name, password, position, avatar, room)
VALUES ('javi', 'Cacahuete', 0, 'media/images/char2.png', 1);

INSERT INTO users (name, password, position, avatar, room)
VALUES ('eric', 'Avocado', 0, 'media/images/char2.png', 1);

USE JabbonDB;

INSERT INTO rooms (name, background, exits, people, range_left, range_right)
VALUES ('Camping', 'media/images/background.png', '{"exit1": [-1,-260,2,1]', '{"user1": 1, "user2": 2}', -260, 200);

INSERT INTO rooms (name, background, exits, people, range_left, range_right)
VALUES ('Forest', 'media/images/forest.png', '{"exit1": [1,200,1,1]}', '{}', -300, 240);

USE JabbonDB;

INSERT into users (id, name, position, avatar, room)
VALUES (1, 'Haylo', 30, '1', 'Hall'), (2, 'Sr.OjeteSucio', 30, '2', 'Hall')
ON DUPLICATE KEY UPDATE name = VALUES(name), position = VALUES(position), avatar = VALUES(avatar), room = VALUES(room);

-- TABLE SHOW
USE JabbonDB;

TABLE users;
TABLE rooms;
TABLE sessions;

-- TABLE DELETE CONTENT

USE JabbonDB;

DELETE FROM users WHERE id = 6;

DELETE FROM sessions;

DELETE FROM users;

DELETE FROM rooms;

-- TABLE DROP

USE JabbonDB;

DROP TABLE users;

DROP TABLE rooms;

USE JabbonDB;

DROP TABLE sessions;


