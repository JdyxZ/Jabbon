const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "Jabbon",
    password: process.env.DB_PASSWORD || "Cacahuete200$",
    database: process.env.DB_DATABASE || "JabbonDB",
    port: process.env.DB_PORT || 3306
});

const values = [ [ [ 2, '{"user0":434,"user1":2323,"user2":54332}' ], [ 3, '{"user0":434,"user1":2323,"user2":54332}' ] ] ];
pool.query( "INSERT INTO rooms (id, people) VALUES ? ON DUPLICATE KEY UPDATE people = VALUES(people);", values);