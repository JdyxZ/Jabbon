const DATABASE = require("./database.js");

async function test()
{
    // Init database connection
    DATABASE.initConnection();

    // Queries
    const [_, [result]] = await DATABASE.validateUserID("4");

    console.log(result);
}

test();

