/***************** DATABASE CREDENTIALS *****************/

// Define user credentials
const USER_CREDENTIALS = 
{
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "Jabbon",
    password: process.env.DB_PASSWORD || "Cacahuete200$",
    port: process.env.DB_PORT || 3306,
    debug: false,
    multipleStatements: true
}

// Define database credentials
const JABBON_CREDENTIALS = 
{
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "Jabbon",
    password: process.env.DB_PASSWORD || "Cacahuete200$",
    database: process.env.DB_DATABASE || "Jabbon_DB",
    port: process.env.DB_PORT || 3306,
    debug: false,
    multipleStatements: true
};

module.exports = {USER_CREDENTIALS, JABBON_CREDENTIALS};