CREATE DATABASE mydb;

USE mydb;

CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    avatar VARCHAR(255),
    position JSON,

    PRIMARY KEY (user_id)
);