//MODEL

var FACING_RIGHT = 0;
var FACING_FRONT = 1;
var FACING_LEFT = 2;
var FACING_BACK = 3;

function Clamp(value, min, max){ return (value < min ? min : ( value > max ? max : value)); }
function Lerp(a,b,f) {return a * (1 - f) + b  * f; }

function User( name)
{
    this.name = name;
    this.position = 40;
    this.avatar = "./media/images/char1.png";
    this.facing = FACING_FRONT;
    this.animation = "idle";
    this.room = "none";

    this.target = [40,0];
}

function Room( name, background)
{
    this.id= data.id;
    this.name= data.name;
    this.background= data.background;
    this.people = data.people;
    this.range = data.range;
}

Room.prototype.addUser = function(user)
{
    this.people.push( user.name );
    user.room = this.name;
}

var WORLD = {
    rooms: {},
    users:{},
    room_count: 0,
    last_id_room: 0,

    getUser:function (name)
    {
        return this.users[name];
    },

    // createRoom:function (name, background)
    // {
    //     var room = new Room( name, background);
    //     room.id = this.last_id_room ++;

    //     this.last_id_room ++ ;
    //     this.room_count ++ ;
    //     this.rooms[name] = room;

    //     return room;
    // },
    createRoom:function (data)
    {
        var room = new Room( data);
        room.id = this.last_id_room ++;

        this.last_id_room ++ ;
        this.room_count ++ ;
        this.rooms[data.name] = room;

        return room;
    },
    

    createUser:function (name)
    {
        var user = new User(name);
        this.users[name] = user;

        return user;
    },

    fromJSON: function( json )
    {
        for(var i in json.rooms)
        {
            this.createRoom(json.rooms)
        }
        this.last_id_room = json.last_id;
    }
}

module.exports = {
    WORLD, Room, User, FACING_RIGHT, FACING_LEFT, FACING_BACK, FACING_FRONT
}