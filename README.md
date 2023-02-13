# Jabbon
 
## Notes

Run server with nodemon: npm run server

## Execution flow

Suggestion: 
    - ExpressJS -> Client - Server communication -> General client requests (log in, sign in, fetch world data, etc.), but also server pings (user join server, user leave server, etc.).
    - WebSocket -> P2P communiaction -> chat and users actions: typing, send message, receive message, user moving (send only target), user changing facing, change room, etc.

## Comments

/* 
createRoom:function (name, background)
{
    var room = new Room( name, background);
    room.id = this.last_room_id ++;

    this.last_room_id ++ ;
    this.num_rooms ++ ;
    this.rooms[name] = room;

    return room;
},
*/