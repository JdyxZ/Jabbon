/***************** DATABASE *****************/
const mysql = require('mysql2/promise');

var DATABASE = {

    // Properties
    pool: null,

    // Methods
    initConnection: async function()
    {
        this.pool = await mysql.createPool({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "Jabbon",
            password: process.env.DB_PASSWORD || "Cacahuete200$",
            database: process.env.DB_DATABASE || "JabbonDB"
        });
    },
    
    pushUser: async function(user, password) 
    {
        try
        {
            // Query
            await this.pool.query( "INSERT INTO users SET name = ?, password = ?, avatar = ?, room_name = ?, position = ? ;", [user.name, password,"deafult.png","start",0]);
            return "OK";
        }
        catch(err)
        {
            return "ERROR";
        }
    },

    validateUsername: async function(username) 
    {
        try
        {
            // Query
            const [res] = await this.pool.query("SELECT * FROM users WHERE name = ? ;", [username]);
            
            // Result
            if(res.length <= 0) return "NOT EXISTS";
            else return "EXISTS";
        }
        catch(err)
        {
            console.log(`ERROR: ${err}`);
            return "ERROR";
        }
    },

    validateUser: async function(user) 
    {
        try
        {
            // Query
            const [res] = await this.pool.query("SELECT * FROM users WHERE name = ? AND password = ? ;", [user.name, user.password]);
            
            // Result
            if(res.length <= 0) return "NOT EXISTS";
            else return "EXISTS";
        }
        catch(err)
        {
            console.log(`ERROR: ${err}`);
            return "ERROR";
        }
    },

    updateUser: async function(user_json)
    {
        try 
        {
            // Get user meaningful properties 
            const { name, position, room } = user_json; 

            // Query
            await this.pool.query("UPDATE users SET room_name = ?, position = ? WHERE name = ? ;",[room, position, name]);
            return "OK";
        } 
        catch(err)
        {
            return "ERROR";
        }
    },

    removeUser: async function(user_id)
    {
        try
        {
            // Query
            const [res] = await this.pool.query("DELETE FROM users WHERE user_id = ? ;", [user_id]);
            
            // Result
            if(res.affectedRows <= 0) return "NOT EXISTS";
            else return "OK";
        }
        catch(err)
        {
            console.log(`ERROR: ${err}`);
            return "ERROR";
        }
    },

    fetchUser: async function(user_id)
    {
        try
        {
            // Query
            return await this.pool.query("SELECT * FROM users WHERE user_id = ? ;", user_id);
        }
        catch(err)
        {
            console.log(`ERROR: ${err}`);
            return "ERROR";
        }
    },

    fetchUsers: async function()
    {
        try
        {
            // Query
            return await this.pool.query("SELECT * FROM users ;");
        }
        catch(err)
        {
            console.log(`ERROR: ${err}`);
            return "ERROR";
        }
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