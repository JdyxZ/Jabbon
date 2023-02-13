/********************************** MODEL **********************************/

/***************** USER *****************/

var FACING_RIGHT = 0;
var FACING_FRONT = 1;
var FACING_LEFT = 2;
var FACING_BACK = 3;

function User(name, position, avatar, facing, animation, room, target)
{
    this.name = name || "unnamed";
    this.position = position || 40;
    this.avatar = avatar || "./media/images/char1.png";
    this.facing = facing || FACING_FRONT;
    this.animation = animation || "idle";
    this.room = room || "none";
    this.target = target || [40,0];
}

/***************** ROOM *****************/

function Room(name, data)
{
    this.id = data.id;
    this.name = name || "unnamed";
    this.background = data.background;
    this.people = data.people;
    this.range = data.range;
}

Room.prototype.addUser = function(user)
{
    this.people.push( user.name );
    user.room = this.name;
}

/***************** WORLD *****************/

var WORLD = {

    // Objects
    rooms: {},
    users:{},

    // Room info
    default_room: null,
    num_rooms: 0,
    last_room_id: 0,

    // Methods
    createRoom: function (name, data)
    {
        var room = new Room(name, data);
        room.id = this.last_room_id ++;

        this.last_room_id++;
        this.num_rooms++;
        this.rooms[name] = room;

        return room;
    },

    createUser: function (name, position, avatar, facing, animation, room, target)
    {
        var user = new User(name, position, avatar, facing, animation, room, target);
        this.users[name] = user;

        return user;
    },

    fromJSON: function(json)
    {
        Object.values(json.rooms).forEach(({name, data}) => this.createRoom(name, data));        
        
        // Set room info
        this.default_room = json.default_room;
        this.last_id_room = json.last_id;
    },

    getUser: function (name)
    {
        return this.users[name];
    }

    getRoom: function(name)
    {
        return this.rooms[name];
    }

}

if(typeof(window) == undefined)
{
    module.exports = {
        WORLD, Room, User, FACING_RIGHT, FACING_LEFT, FACING_BACK, FACING_FRONT
    }
}