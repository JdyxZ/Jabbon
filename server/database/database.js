/***************** DATABASE *****************/
const mysql = require('mysql2/promise');

var DATABASE = {

    // Properties
    pool: null,

    // Methods
    initConnection: async function()
    {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "Jabbon",
            password: process.env.DB_PASSWORD || "Cacahuete200$",
            database: process.env.DB_DATABASE || "JabbonDB",
            port: process.env.DB_PORT || 3306
        });
    },
    
    pushUser: async function(user_json) 
    {
        try
        {
            // Destructure json
            const { name, password, avatar, room, position} = user_json; 

            // Throw errors
            if(!name) throw "You must send a name";
            if(!password) throw "You must send a password";
            if(!avatar) throw "You must send an avatar";
            if(!room) throw "You must send a room";
            if(!position) throw "You must send a position";
            
            // Query            
            return {type: "OK", content: await this.pool.query( "INSERT INTO users SET name = ?, password = ?, avatar = ?, room_name = ?, position = ? ;", [name, password, avatar, room, position])};
        }
        catch(err)
        {
            // Error
            console.log(err);
            return {type: "ERROR", content: `${err}`};
        }
    },

    validateUsername: async function(username) 
    {
        try
        {
            // Throw errors
            if(!username) throw "You must send a username";
            
            // Query
            return {type: "OK", content: await this.pool.query("SELECT * FROM users WHERE name = ? ;", [username])};
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return {type: "ERROR", content: `${err}`};
        }
    },

    validateUser: async function(user_json) 
    {
        try
        {
            // Destructure json
            const {name, password} = user_json;

            // Throw errors
            if(!name) throw "You must send a username";
            if(!password) throw "You must send a password";

            // Query
            return {type: "OK", content: await this.pool.query("SELECT * FROM users WHERE name = ? AND password = ? ;", [name, password])};
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return {type: "ERROR", content: `${err}`};
        }
    },

    updateUser: async function(user_json)
    {
        try 
        {
            // Get user meaningful properties 
            const { name, position, room } = user_json; 

            // Throw errors
            if(!name) throw "You must send a name";
            if(!position) throw "You must send a position";
            if(!room) throw "You must send a room";

            // Query
            return {type: "OK", content: await this.pool.query("UPDATE users SET room_name = ?, position = ? WHERE name = ? ;",[room, position, name])};
        } 
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return {type: "ERROR", content: `${err}`};
        }
    },

    removeUser: async function(user_id)
    {
        try
        {
            // Throw errors
            if(!user_id) throw "You must send a user_id";

            // Query
            return {type: "OK", content: await this.pool.query("DELETE FROM users WHERE user_id = ? ;", [user_id])};
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return {type: "ERROR", content: `${err}`};
        }
    },

    fetchUser: async function(user_id)
    {
        try
        {
            // Throw errors
            if(!user_id) throw "You must send a user_id";

            // Query
            return {type: "OK", content: await this.pool.query("SELECT * FROM users WHERE user_id = ? ;", user_id)};
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return {type: "ERROR", content: `${err}`};
        }
    },

    fetchUsers: async function()
    {
        try
        {
            // Query
            return {type_users: "OK", users: await this.pool.query("SELECT * FROM users ;")};
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return {type: "ERROR", content: `${err}`};
        }
    },

    fetchRooms: async function()
    {
        try
        {
            // Query
            return {type_rooms: "OK", rooms: await this.pool.query("SELECT * FROM rooms ;")};
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return {type: "ERROR", content: `${err}`};
        } 
    },

    updateModel: async function(user_json, room_json)
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
    }
}

module.exports = DATABASE;