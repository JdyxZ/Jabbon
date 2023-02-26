/***************** DATABASE LAYOUT *****************/

-- CREATE USER
CREATE USER IF NOT EXISTS 'Haylo'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
CREATE USER IF NOT EXISTS 'Jabbon'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Cacahuete200$';

GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'Haylo'@'localhost' WITH GRANT OPTION;
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'Jabbon'@'localhost' WITH GRANT OPTION;

FLUSH PRIVILEGES;

SELECT * FROM mysql.USER;

-- DROP USER IF EXISTS 'mysql'@'localhost';

-- CREATE DATABASE

-- DROP DATABASE IF EXISTS Jabbon_DB;
CREATE DATABASE IF NOT EXISTS Jabbon_DB;

USE Jabbon_DB;

CREATE TABLE IF NOT EXISTS jabbon_users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    position INT,
    avatar VARCHAR(255),
    room INT,

    PRIMARY KEY (id)
);

USE Jabbon_DB;

CREATE TABLE IF NOT EXISTS jabbon_rooms (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    background VARCHAR(255),
    exits JSON,
    people JSON,
    range_left INT,
    range_right INT,

    PRIMARY KEY (id)
);

-- INSERTS

USE Jabbon_DB;

INSERT IGNORE INTO jabbon_users (id, name, password, position, avatar, room)
VALUES (1, 'javi', 'Cacahuete', 0, 'media/images/char2.png', 1);

INSERT IGNORE INTO jabbon_users (id, name, password, position, avatar, room)
VALUES (2, 'eric', 'Avocado', 0, 'media/images/char2.png', 1);

USE Jabbon_DB;

INSERT IGNORE INTO jabbon_rooms (id, name, background, exits, people, range_left, range_right)
VALUES (1, 'Camping', 'media/images/background.png', '{"exit1": [-1,-260,2,1]}', '{}', -260, 200);

INSERT IGNORE INTO jabbon_rooms (id, name, background, exits, people, range_left, range_right)
VALUES (2, 'Forest', 'media/images/forest.png', '{"exit1": [1,200,1,1]}', '{}', -300, 240);

-- UPDATE USERS

USE Jabbon_DB;

INSERT into jabbon_users (id, name, position, avatar, room)
VALUES (1, 'Haylo', 30, '1', 'Hall'), (2, 'Sr.OjeteSucio', 30, '2', 'Hall')
ON DUPLICATE KEY UPDATE name = VALUES(name), position = VALUES(position), avatar = VALUES(avatar), room = VALUES(room);

-- TABLE SHOW
USE Jabbon_DB;

SHOW TABLES;

USE Jabbon_DB;

TABLE jabbon_users;
TABLE jabbon_rooms;
TABLE jabbon_sessions;

-- TABLE DELETE CONTENT

USE Jabbon_DB;

DELETE FROM jabbon_sessions;

DELETE FROM jabbon_users;

DELETE FROM jabbon_rooms;

-- TABLE DROP

USE Jabbon_DB;

DROP TABLE jabbon_users;

DROP TABLE jabbon_rooms;

USE Jabbon_DB;

DROP TABLE jabbon_sessions;


