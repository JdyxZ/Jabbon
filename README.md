# Jabbon
 
## Notes

Run server with nodemon: npm run server

## Execution flow

Suggestion: 
    - ExpressJS -> Client - Server communication -> General client requests (log in, sign in, fetch world data, etc.), but also server pings (user join server, user leave server, etc.).
    - WebSocket -> P2P communiaction -> chat and users actions: typing, send message, receive message, user moving (send only target), user changing facing, change room, etc.

## Websocket messages protocol

Suggestion:
    - type: Error, Text, Profile (User data), Typing, etc.
    - content: utf8data.
    - sender: username.
    - time: time.

## Comments

// Enable redirecting
if (response.redirected) {
    window.location.href = response.url;
};

getIDByUserID:function(_id)
{
    for(i = 0; i < this.users.length; i++)
    {
        if(this.users[i].id == _id) return i;
    }
},




