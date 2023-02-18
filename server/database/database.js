
/***************** DATABASE *****************/
const mysql = require('mysql2/promise');
const CREDENTIALS = require('./credentials.js');
require("../../public/framework.js");

var DATABASE = {

    // Properties
    pool: null,

    // Methods
    initConnection: async function()
    {
        this.pool = mysql.createPool(CREDENTIALS);
    },

    /***************** USER *****************/

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
            await this.pool.query( "INSERT INTO users SET name = ?, password = ?, avatar = ?, room_name = ?, position = ? ;", [name, password, avatar, room, position]);
            
            // Output
            return ["OK", null];
        }
        catch(err)
        {
            // Error
            console.log(err);
            return ["ERROR", `${err}`];
        }
    },

    validateUsername: async function(username) 
    {
        try
        {
            // Throw errors
            if(!username) throw "You must send a username";
            
            // Query
            return ["OK", await this.pool.query("SELECT * FROM users WHERE name = ? ;", [username])];
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return ["ERROR", `${err}`];
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
            return ["OK", await this.pool.query("SELECT * FROM users WHERE name = ? AND password = ? ;", [name, password])];
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return ["ERROR", `${err}`];
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
            await this.pool.query("UPDATE users SET room_name = ?, position = ? WHERE name = ? ;", [room, position, name]);

            // Output
            return ["OK", null];
        } 
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return ["ERROR", `${err}`];
        }
    },

    removeUser: async function(user_id)
    {
        try
        {
            // Throw errors
            if(!user_id) throw "You must send a user_id";

            // Query
            await this.pool.query("DELETE FROM users WHERE user_id = ? ;", [user_id]);

            // Output
            return ["OK", null];
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return ["ERROR", `${err}`];
        }
    },

    fetchUser: async function(user_id)
    {
        try
        {
            // Throw errors
            if(!user_id) throw "You must send a user_id";

            // Query
            return ["OK", await this.pool.query("SELECT * FROM users WHERE user_id = ? ;", user_id)];
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return ["ERROR", `${err}`];
        }
    },

    /***************** USERS *****************/

    updateUsers: async function(users) 
    {
        try
        {
            // Wrap values into an array
            const values = Object.values(users).reduce((values, user) => {
                values.push([user.id, user.name, user.position, user.avatar, user.room]);
                return values;
            }, []);

            // Query
            await this.pool.query( "INSERT INTO users (id, name, position, avatar, room) VALUES ? ON DUPLICATE KEY UPDATE name = VALUES(name), position = VALUES(position), avatar = VALUES(avatar), room = VALUES(room);", [values]);
            
            // Output
            return ["OK", null];
        }
        catch(err)
        {
            // Error
            console.log(err);
            return ["ERROR", `${err}`];
        }
    },

    removeUsers: async function()
    {
        try
        {
            // Query
            await this.pool.query("DELETE FROM users;");

            // Output
            return ["OK", null];
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return ["ERROR", `${err}`];
        }
    },

    fetchUsers: async function()
    {
        try
        {
            // Query
            return ["OK", await this.pool.query("SELECT * FROM users;")];
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return ["ERROR", `${err}`];
        }
    },

    /***************** ROOMS *****************/

    updateRooms: async function(rooms) 
    {
        try
        {
            // Wrap values into an array
            const values = Object.values(rooms).reduce((values, room) => {
                const people_json = JSON.stringify(room.people.toObject("user"));
                values.push([room.id, people_json]);
                return values;
            }, []);

            // Query            
            await this.pool.query( "INSERT INTO rooms (id, people) VALUES ? ON DUPLICATE KEY UPDATE people = VALUES(people);", [values]);

            // Output
            return ["OK", null];
        }
        catch(err)
        {
            // Error
            console.log(err);
            return ["ERROR", `${err}`];
        }
    },

    removeRooms: async function()
    {
        try
        {
            // Query
            await this.pool.query("DELETE FROM rooms;");

            // Output
            return ["OK", null];
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return ["ERROR", `${err}`];
        }
    },

    fetchRooms: async function()
    {
        try
        {
            // Query
            return ["OK", await this.pool.query("SELECT * FROM rooms;")];
        }
        catch(err)
        {
            // Error
            console.log(`${err}`);
            return ["ERROR", `${err}`];
        } 
    },

    /***************** MODEL *****************/

    fetchModel: async function()
    {
        const [rooms_status, rooms] = await DATABASE.fetchRooms();
        if(rooms_status == "ERROR") return [rooms_status, rooms];

        const [users_status, users] = await DATABASE.fetchUsers();
        if (users_status == "ERROR") return [users_status, users];

        return ["OK", {rooms: rooms[0], users: users[0]}];
    },

    updateModel: async function(world)
    {
        const [rooms_status, rooms_result] = await DATABASE.updateRooms(world.rooms);
        if(rooms_status == "ERROR") return [rooms_status, rooms_result];

        const [users_status, users_result] = await DATABASE.updateUsers(world.users);
        if (users_status == "ERROR") return [users_status, users_result];

        return ["OK", null];  
    },

    /***************** CONVERSATION LOG *****************/

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