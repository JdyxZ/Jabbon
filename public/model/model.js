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
    this.position = data == undefined ? 0 : data.position || 0;
    this.avatar = data == undefined ? "./media/images/char1.png" : data.avatar || "./media/images/char1.png";
    this.facing = data == undefined ? FACING_FRONT : data.facing || FACING_FRONT;
    this.animation = data == undefined ? "idle" : data.animation || "idle";
    this.room = data == undefined ? 1 : data.room || 1;
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

Room.prototype.toJSON = function()
{
    const room_json =
    {
        id : this.id,
        name: this.name,
        background: this.background,
        people: this.people,
        exits: this.exits,
        range: this.range
    }

    // Output JSON
    return room_json;
}

Room.prototype.getUsers = function(users_id)
{
    // Checkings
    if (isNumber(users_id) || isString(users_id)) users_id = users_id.toArray();    
    else if (!users_id instanceof Array)
    {
        console.log(`ERROR ---> Invalid input "${users_id}" in function getUsers of Room Class. Returning null`);
        return null;
    }

    return user_room.people.clone().remove(users_id);
}

/***************** MESSAGE *****************/
function Message(sender, type, content, time)
{
    this.sender = sender || ""; //ID
    this.type = type || "ERROR";
    this.content = content || "";
    this.time = time || getTime();
}