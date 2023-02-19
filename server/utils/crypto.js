const bcrypt = require('bcryptjs');

const CRYPTO =
{
    encrypt: async function(password)
    {
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);
        return hashed_password;
    },

    match: async function(password, hashed_password)
    {
        const result = await bcrypt.compare(password, hashed_password);
        return result;
    }
}