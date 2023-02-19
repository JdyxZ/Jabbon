const DATABASE = require("./database.js");

async function test()
{
    // Init database connection
    DATABASE.initConnection();

    // Queries
    const [_, [result]] = await DATABASE.validateUsername("pedro");

    console.log(result);
}

test();

