/***************** DATABASE TESTS *****************/

const DATABASE = require("./database.js");
const CRYPTO = require("../utils/crypto.js");

async function test()
{
    // Init database connection
    DATABASE.initConnection();

    // Queries

    // Hash password
    name = "raquel2",
    password = "Holaejs2001$";
    const hashed_password = await CRYPTO.encrypt(password);  

    // Check user credentials
    let [status, result] = await DATABASE.validateUsername(name, hashed_password);

    console.log(result[0][0].id);
}

test();

