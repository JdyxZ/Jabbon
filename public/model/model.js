/********************************** MODEL **********************************/

/***************** USER *****************/

const FACING_RIGHT = 0;
const FACING_FRONT = 1;
const FACING_LEFT = 2;
const FACING_BACK = 3;

function User(data)
{   
    this.id = data == undefined ? -1 : data.id || -1;
    this.name = data == undefined ? "unnamed" : data.name || "unamed";
    this.position = data == undefined ? 40 : data.position || 40;
    this.avatar = data == undefined ? "./media/images/char1.png" : data.avatar || "./media/images/char1.png";
    this.facing = data == undefined ? FACING_FRONT : data.facing || FACING_FRONT;
    this.animation = data == undefined ? "idle" : data.animation || "idle";
    this.room = data == undefined ? "none" : data.room || "none";
    this.target = data == undefined ? [40,0] : data.target || [40,0];
}

User.prototype.toJSON = function()
{
    const user_json =
    {
        id : this.id,
        name: this.name,
        position: this.position,
        avatar: this.avatar,
        facing: this.facing,
        animation: this.animation,
        room: this.room,
        target: this.target
    }

    // Output JSON
    return user_json;
}

User.prototype.toJSONSimplified = function()
{
    // Make a copy of the properties that we want to share
    const user_json =
    {
        id : this.id,
        target: this.target
    }

    // Output JSON
    return user_json;
}

/***************** ROOM *****************/

function Room(data)
{
    this.id = data == undefined ? -1 : data.id || -1;
    this.name = data == undefined ? "unnamed" : data.name || "unnamed";
    this.background = data == undefined ? "./public/media/images/background.png" : data.background || "./public/media/images/background.png";
    this.exits = data == undefined ? [] : data.exits || [];
    this.people = data == undefined ? [] : data.people || []; //ids
    this.range = data == undefined ? [] : data.range || [];
}

Room.prototype.addUser = function(user)
{
    this.people.push( user.id );
    user.room = this.name;
}

Room.prototype.toJSON = function()
{
    const room_json =
    {
        id : this.id,
        name: this.name,
        background: this.background,
        people: this.people,
        range: this.range
    }

    // Output JSON
    return room_json;
}

Room.prototype.getUsers = function()
{
    return this.people;
}

/***************** WORLD *****************/

var WORLD = {

    // Objects
    rooms: {},
    users: {},
    num_users: 0,
    num_rooms: 0,

    // Methods
    init: function(rooms_array, users_array)
    {
        rooms_array.map( room => 
        {
            room.exits = Object.values(room.exits);
            room.people = Object.values(room.people);
            room.range = [room.range_left, room.range_right];
            delete room.range_left;
            delete room.range_right;
            return room
        });

        const world_json =
        {
            rooms: rooms_array,
            users: users_array
        }

        this.fromJSON(world_json);

        // Notify success
        console.log(`World data successfully loaded! \nNumber of rooms ${WORLD.num_rooms}`);
    },

    createUser: function (data)
    {
        var user = new User(data);
        this.num_users++;
        this.users[user.id] = user;
        return user;
    },

    createRoom: function (data)
    {
        var room = new Room(data);
        this.num_rooms++;
        this.rooms[room.id] = room;
        return room;
    },

    getUser: function (id)
    {
        return this.users[id];
    },

    getRoom: function(id)
    {
        return this.rooms[id];
    },

    addUser: function(user)
    {
        if(users[user.id] != undefined)
        {
            console.error(`The user ${user.name} already exists`);
            return;
        }

        users[user.id] = user;
    },

    addRoom: function(room)
    {
        if(rooms[room.id] != undefined)
        {
            console.error(`The room ${room.name} already exists`);
            return;
        }

        rooms[room.id] = room;
    },
    
    removeUser: function(id)
    {
        delete users.id;
    },

    addUsertoRoom: function(user_id, room_id)
    {
        const user = this.getUser(user_id);
        const room = this.getRoom(room_id);
        room.addUser(user);
    },

    fromJSON: function(world_json)
    {
        // Create rooms
        world_json.rooms.forEach(room_json => {
            this.createRoom(room_json);
        }); 
    
        // Create users
        world_json.users.forEach(user_json => {
            const user = this.createUser(user_json);
            this.addUsertoRoom(user.id, user.room);
        }); 
    },

    toJSON: function()
    {
        const{rooms, users, num_rooms, num_users} = this;

        world_json =
        {
            num_rooms,
            num_users,
            rooms,
            users
        }

        return JSON.stringify(world_json, null, 2);
    }
}

/***************** MESSAGE *****************/
function Message(sender, type, content, time)
{
    this.sender = sender || ""; //ID
    this.type = type || "ERROR";
    this.content = content || "";
    this.time = time || "getTime()";
}

if(typeof(window) == "undefined")
{
    module.exports = {
        WORLD, Room, User, FACING_RIGHT, FACING_FRONT, FACING_LEFT, FACING_BACK, Message
    }
}