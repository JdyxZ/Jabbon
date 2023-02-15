/********************************** MODEL **********************************/

/***************** USER *****************/

const FACING_RIGHT = 0;
const FACING_FRONT = 1;
const FACING_LEFT = 2;
const FACING_BACK = 3;

function User(data)
{
    this.id = WORLD.last_user_id++;
    this.name = data.name || "unnamed";
    this.position = data.position || 40;
    this.avatar = data.avatar || "./media/images/char1.png";
    this.facing = data.facing || FACING_FRONT;
    this.animation = data.animation || "idle";
    this.room = data.room || "none";
    this.target = data.target || [40,0];
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

User.prototypetoJSONSimplified = function()
{
    // Make a copy of the properties that we want to share
    const user_json =
    {
        id : this.id,
        facing: this.facing,
        room: this.room,
        target: this.target
    }

    // Output JSON
    return user_json;
}

/***************** ROOM *****************/

function Room(data)
{
    this.id = WORLD.last_room_id ++;
    this.name = data.name || "unnamed";
    this.background = data.background;
    this.people = data.people;
    this.range = data.range;
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

/***************** WORLD *****************/

var WORLD = {

    // Objects
    rooms: {},
    users: {},

    // Room info
    default_room: null,
    num_users: 0,
    num_rooms: 0,
    last_room_id: 0,
    last_user_id: 0,

    // Methods
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

    getUser: function (name)
    {
        return this.users[name];
    },

    getRoom: function(name)
    {
        return this.rooms[name];
    },

    addUser: function(user)
    {
        if(users[user.id] != undefined)
        {
            console.error(`The user ${user.name} already exists`);
            return;
        }

        users[user.name] = user;
    },

    addRoom: function(room)
    {
        if(rooms[room.id] != undefined)
        {
            console.error(`The room ${room.name} already exists`);
            return;
        }

        rooms[room.name] = room;
    },

    fromJSON: function(json)
    {
        // Create rooms
        json.rooms.forEach(room => {
            this.createRoom(room);
        });            
        
        // Set room general info
        this.default_room = json.default_room;
        this.last_id_room = json.last_id;
    },

    toJSON: function()
    {
        // TODO
        return JSON.stringify(WORLD);
    }
}

/***************** MESSAGE *****************/
function Message(sender, type, content, time)
{
    this.sender = sender || "";
    this.type = type || "ERROR";
    this.content = content || "";
    this.time = time || getTime();
}

if(typeof(window) == "undefined")
{
    module.exports = {
        WORLD, Room, User, FACING_RIGHT, FACING_FRONT, FACING_LEFT, FACING_BACK
    }
}