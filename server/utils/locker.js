var LOCKER =
{
    isLogged: function(req, res, next)
    {
        if(req.isAuthenticated())
        {
            return next();
        }
        return res.redirect("/signup");
    },

    isNotLogged: function(req, res, next)
    {
        if(!req.isAuthenticated())
        {
            return next();
        }
        return res.redirect("/canvas");
    }
}

module.exports = LOCKER;