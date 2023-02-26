/***************** DATABASE TESTS *****************/

const DATABASE = require("../database/database.js");
const CRYPTO = require("../utils/crypto.js");
const fs = require('fs').promises;

async function test()
{
    // Init database connection
    await DATABASE.init();

    // Read files
    const data = await fs.readFile("../database/init.sql");
    console.log(data);

    // Queries
    //const result = await DATABASE.pool.execute("");
    //console.log(result[0]);

}

test();

