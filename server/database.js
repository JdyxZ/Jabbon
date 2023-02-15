var mysql = require('mysql');

//DATABASE

function DataBase() 
{

}

DataBase.prototype.getUsers = function(username)
{
  this.connection.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
}

//users = JSON.parse(JSON.stringify(result));

//  Yo me refería a hacer esto:

// Imports
var mysql = require('mysql');

var DATABASE = {

  // atributos necesarios
  connection: null,
  [...]

  // métodos
  initConnection: function()
  {
    //Create the connection
    this.connection = mysql.createConnection
    ({
      host: "localhost",
      user: "root",
      password: "Cacahuete200$",
      database: "mydb"
    });

    //Connect to the db
    this.connection.connect(function(err) {
      if (err) throw err;
        console.log("Connected! TO THE DB");
    });

  },
  
  pushUser: async function(user_info) // es decir, signin
  {
    //Save the self for the second query callback
    var self = this;
    var query = "SELECT * FROM users WHERE name = ?";
    //First check if the username exists
    this.connection.query(query,user_info['username'], function (err, result, fields) {
      if (err) throw err;
      if (!JSON.parse(JSON.stringify(result))){

        /* ******************************************** */
        //Para insertar usuarios AÑADIR propiedades para guardar de momento position, avatar, target "maybe"
        /* ******************************************** */

        var query_2 = "INSERT INTO users SET userId = ?, name = ?, password = ?";
        //Now insert the user to the db
        self.connection.query(query_2,['2',user_info['user'],user_info['password']], function(err) {
          if (err) throw err;
          //return 2
        });
      }

      //return 0

    });
  },

  validateUser: async function(username) // es decir, login
  {
    var query = "SELECT * FROM users WHERE name = ?, password = ?";
    this.connection.query(query,[username['user'],username['password']] function (err, result, fields) {
      if (err) throw err;
      user = JSON.parse(JSON.stringify(result));
      //if (!user) console.log("Wrong credentials");
      //return user
    });
  },

  updateUser: async function(user_json)
  {
    // TODO
  },

  removeUser: async function(user_id)
  {
    var query = "DELETE FROM users WHERE id = ?"
    this.connection.query(query,[user_id], function (err, result, fields) {
      if (err) throw err;
    });
  },

  fetchUser: async function(user_id)
  {
    var query = "SELECT * FROM users WHERE userId = ?"
    this.connection.query(query,[user_id], function (err, result, fields) {
      if (err) throw err;
      return result;
    });
  },

  fetchUsers: async function()
  {
    var query = "SELECT * FROM users"
    this.connection.query(query, function (err, result, fields) {
      if (err) throw err;
      users = JSON.parse(JSON.stringify(result));
      return users
    });
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

  signin: function(user_info)
  {
    [...] // Lo que tengamos que hacer previamente.
    DATABASE.pushUser(user_info);
    [...] // Lo que después hagamos.
  }
}

// Y así evitamos embedear código de la database en el namespace del server :)










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