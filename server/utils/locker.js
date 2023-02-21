/***************** LOCKER MIDDLEWARES *****************/
const SERVER = require("../server.js");

var LOCKER =
{
    isSessionAvailable: function(req, res, next)
    {
          // Get user id
          const user_id = req.session.passport == undefined ? null: req.session.passport.user;

          // Compute booleans
          const session_active = req.isAuthenticated();
          const connection_active = user_id == null ? false : LOCKER.checkConnection(user_id);
          
          // Accessing after a while: A session active and 0 connections
          if(session_active && !connection_active)
          {
              console.log(`LOCKER CONTROL ---> User ${user_id} status: Session active and no connection`);
              return next();
          }
  
          return res.redirect("/login");
    },

    isSessionNotAvailable: function(req, res, next)
    {
        // Get user id
        const user_id = req.session.passport == undefined ? null: req.session.passport.user;

        // Compute booleans
        const session_active = req.isAuthenticated();
        const connection_active = user_id == null ? false : LOCKER.checkConnection(user_id);
        
        // Already someone in a second window: A session and a connection active
        if(session_active && connection_active)
        {
            console.log(`LOCKER CONTROL ---> User ${user_id} status: Session active and connection active`);
            return next();
        }
        
        // First time: No session nor connection active
        if(!session_active && !connection_active)
        {
            console.log(`LOCKER CONTROL ---> User ${user_id} status: No session active and no connection active`);
            return next();
        }

        return res.redirect("/canvas");
    },

    checkConnection: function(user_id)
    {
        return Object.keys(SERVER.clients).includes(user_id.toString());
    },

    deleteCurrentSession: async function(req)
    {
        await req.logout();
    }
}

module.exports = LOCKER;