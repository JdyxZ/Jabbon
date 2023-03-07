-- CREATE DATABASE
CREATE DATABASE IF NOT EXISTS Jabbon_DB;
USE Jabbon_DB;

-- CREATE TABLES
CREATE TABLE IF NOT EXISTS jabbon_users (
    id INT NOT NULL AUTO_INCREMENT,
    social JSON,
    name VARCHAR(255) UNIQUE,
    password VARCHAR(255) DEFAULT NULL,
    position INT,
    avatar VARCHAR(255),
    room INT,

    PRIMARY KEY (id)
);

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

-- CREATE ROOMS
INSERT IGNORE INTO jabbon_rooms (id, name, background, exits, people, range_left, range_right)
VALUES (1, 'Camping', 'media/images/background.png', '{"exit1": [-1,-260,2,1]}', '{}', -260, 200);

INSERT IGNORE INTO jabbon_rooms (id, name, background, exits, people, range_left, range_right)
VALUES (2, 'Forest', 'media/images/forest.png', '{"exit1": [1,200,1,1]}', '{}', -300, 240);