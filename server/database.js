/***************** CLIENT *****************/

// Imports
var mysql = require('mysql');

var DATABASE = {

    // Properties
    connection: null,

    // Methods
    initConnection: function()
    {
        //Create the connection
        this.connection = mysql.createConnection(
        {
            host: "localhost",
            user: "root",
            password: "Cacahuete200$",
            database: "mydb"
        });

        //Connect to the db
        return new Promise((resolve, fail) => 
        {
            this.connection.connect(function(err) {
                if (err) return fail(err);
                resolve();
            });
        });
    },

    pushUser: function(user, password) 
    {
        // Query
        const query = "INSERT INTO users SET userId = ?, name = ?, password = ?";

        //Now insert the user to the db
        return new Promise((resolve, fail) => 
        {
            this.connection.query(query,['2', user.name, password], function(err) {
                if (err) return fail(err);
                resolve();
            });
        });
    },

    validateUsername: function(username) 
    {
        // Query
        const query = "SELECT * FROM users WHERE name = ?";

        return new Promise( (resolve,fail) => 
        {
            this.connection.query(query, [username], function (err, result, fields) {
                if (err) return fail(err);
                resolve(result.length == 0);    
            });
        });
    },

    validateUser: function(username) 
    {
        // Query
        var query = "SELECT * FROM users WHERE name = ?, password = ?";

        return new Promise( (resolve, fail) => 
        {
            this.connection.query(query,[username['user'],username['password']], function (err, result, fields) {
                if (err) return fail(err);
                resolve(result);
            });
        });
    },

    updateUser: function(user_json)
    {
    // TODO
    },

    removeUser: function(user_id)
    {
        // Query
        const query = "DELETE FROM users WHERE id = ?";

        return new Promise((resolve, fail) => 
        {
            this.connection.query(query,[user_id], function (err, result, fields) {
                if (err) return fail(err);
                resolve();
            });
        });   
    },

    fetchUser: function(user_id)
    {
        // Query
        const query = "SELECT * FROM users WHERE userId = ?";

        return new Promise((resolve, fail) => 
        {
            this.connection.query(query,[user_id], function (err, result, fields) {
                if (err) return fail(err);
                return resolve(result);
            });
        });
    },

    fetchUsers: function()
    {
        // Query
        const query = "SELECT * FROM users";

        return new Promise((resolve, fail) => {
            
            this.connection.query(query, function (err, result, fields) {
                if(err) return fail(err);
                users = JSON.parse(JSON.stringify(result));
                resolve(result);
            });
        });
    },

    fetchModel: function()
    {
        // TODO: get and return la model info
    },

    updateModel: function(model_json)
    {
        // TODO: update model info
    },

    fetchLog: function()
    {
        // TODO: get and return del log de las conversaciones
    },

    updateLog: function(log_json)
    {
        // TODO: update log de las conversaciones
    },

    getInfo: function()
    {
        // TODO: toda la información de la database
    },

}

module.exports = DATABASE;