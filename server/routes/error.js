/***************** ERROR ROUTE *****************/

// External modules
const express = require('express');
const router = express.Router();

// Define a default response message
const res_message = `Page not found. Try with one of the following: \n- /login \n- /signup \n- /canvas`;

// Error route
app.use((req, res, next) => {

    // Set response status to indicate the client that the page hasn't been found
    res.status(404);
  
    // Respond with the error page
    if (req.accepts('html')) {
      res.render("error");
      return;
    }
  
    // Respond with json
    if (req.accepts('json')) {
      res.json({ error: res_message});
      return;
    }

    // Otherwise, send a txt 
    res.type('txt').send(res_message);
});

// Export module
module.exports = router;

