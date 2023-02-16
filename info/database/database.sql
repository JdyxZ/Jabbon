CREATE DATABASE mydb;

USE mydb;

CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    avatar VARCHAR(255),
    room_name VARCHAR(255),
    position INT,

    PRIMARY KEY (user_id)
);

DELETE DATABASE mydb;