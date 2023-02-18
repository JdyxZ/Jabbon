CREDENTIALS = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "Jabbon",
    password: process.env.DB_PASSWORD || "Cacahuete200$",
    database: process.env.DB_DATABASE || "JabbonDB",
    port: process.env.DB_PORT || 3306
}

module.exports = CREDENTIALS;