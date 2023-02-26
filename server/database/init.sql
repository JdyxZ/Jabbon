-- CREATE DATABASE
DROP DATABASE IF EXISTS JabbonDB;
CREATE DATABASE JabbonDB;
USE JabbonDB;

-- CREATE TABLES
CREATE TABLE IF NOT EXISTS jabbon_users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    password VARCHAR(255),
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
INSERT INTO jabbon_rooms (name, background, exits, people, range_left, range_right)
VALUES ('Camping', 'media/images/background.png', '{"exit1": [-1,-260,2,1]}', '{"user1": 1, "user2": 2}', -260, 200);

INSERT INTO jabbon_rooms (name, background, exits, people, range_left, range_right)
VALUES ('Forest', 'media/images/forest.png', '{"exit1": [1,200,1,1]}', '{}', -300, 240);