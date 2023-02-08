var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Cacahuete200$",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  // con.query("CREATE DATABASE mydb", function (err, result) {
  //   if (err) throw err;
  //   console.log("Database created");
  // });

  // var sql = "CREATE TABLE users (userId INT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255))";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table created");
  // });

  //Query to insert user into db
  // var insert_user = "INSERT INTO users SET userId = ?, name = ?, password = ?"
  // con.query(insert_user,['1','javier','4321'], function(err) {
  //   if (err) throw err;
  //   console.log("Data inserted");
  // });

  //Query get user into db
  // con.query("SELECT * FROM users", function (err, result, fields) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  
});