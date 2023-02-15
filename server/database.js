var mysql = require('mysql');

//DATABASE

function DataBase() 
{

  this.connection = mysql.createConnection
    ({
      host: "localhost",
      user: "root",
      password: "Cacahuete200$",
      database: "mydb"
    });

}

DataBase.prototype.getUsers = function(username)
{
  this.connection.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
}

/*

//  Yo me refería a hacer esto:

// Imports
var mysql = require('mysql');

var DATABASE = {

  // atributos necesarios
  connection: null,
  [...]

  // métodos
  initConnection: function([...])
  {
    // TODO
  },
  
  pushUser: async function(user_info) // es decir, signin
  {
    // TODO: El código que has puesto en server
  },

  validateUser: async function(username) // es decir, login
  {
    // TODO: el código que has puesto en server
  },

  updateUser: async function(user_json)
  {
    // TODO
  },

  removeUser: async function(user_id)
  {
    // TODO
  },

  fetchUser: async function(user_id)
  {
    // TODO: información del usuario
  },

  fetchUsers: async function(user_id)
  {
    // TODO: información de los usuarios
  },

  fetchModel: async function()
  {
    // TODO: get and return la model info
  },

  updateModel: async function(model_json)
  {
    // TODO: update model info
  },

  fetchLog: async function()
  {
    // TODO: get and return del log de las conversaciones
  },

  updateLog: async function(log_json)
  {
    // TODO: update log de las conversaciones
  },

  getInfo: async function()
  {
    // TODO: toda la información de la database
  },

}

module.exports = DATABASE;

// Entonces, luego en server, por ejemplo en la función signin:

// Imports
[...]
const DATABASE = require(./database.js);

var SERVER = {
  [...]

  signin: function(credentials)
  {
    [...] // Lo que tengamos que hacer previamente.
    DATABASE.pushUser(credentials);
    [...] // Lo que después hagamos.
  }
}

// Y así evitamos embedear código de la database en el namespace del server :)


*/







// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   // con.query("CREATE DATABASE mydb", function (err, result) {
//   //   if (err) throw err;
//   //   console.log("Database created");
//   // });

//   // var sql = "CREATE TABLE users (userId INT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255))";
//   // con.query(sql, function (err, result) {
//   //   if (err) throw err;
//   //   console.log("Table created");
//   // });

//   //Query to insert user into db
//   // var insert_user = "INSERT INTO users SET userId = ?, name = ?, password = ?"
//   // con.query(insert_user,['1','javier','4321'], function(err) {
//   //   if (err) throw err;
//   //   console.log("Data inserted");
//   // });

//   //Query get user into db
//   // con.query("SELECT * FROM users", function (err, result, fields) {
//   //   if (err) throw err;
//   //   console.log(result);
//   // });

  
// });