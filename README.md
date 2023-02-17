# Jabbon
 
## Notes

Run server with nodemon: npm run server

## Execution flow

Suggestion: 
    - ExpressJS -> Client - Server communication -> General client requests (log in, sign in, fetch world data, etc.), but also server pings (user join server, user leave server, etc.).
    - WebSocket -> P2P communiaction -> chat and users actions: typing, send message, receive message, user moving (send only target), user changing facing, change room, etc.

## Websocket messages protocol

Suggestion:
    - type: Error, Text, Profile (User data), Typing, etc.
    - content: utf8data.
    - sender: username.
    - time: time.

## Comments

/* 
createRoom:function (name, background)
{
    var room = new Room( name, background);
    room.id = this.last_room_id ++;

    this.last_room_id ++ ;
    this.num_rooms ++ ;
    this.rooms[name] = room;

    return room;
},
*/

// SERVER
/*
    signup: function(credentials)
    {
     
        // Create new user and store it
        const user = WORLD.createUser(null);
        user.name = credentials.username;
        user.avatar = credentials.avatar;
        const room = WORLD.getRoom(WORLD.default_room);
        room.addUser(user);

        // Database push
        const result2 = DATABASE.pushUser(user, credentials.password);
        console.log(result2);
    },

    login: function(credentials)
    {
       const result = DATABASE.validateUser(credentials);
       console.log(result);
    }
*/


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