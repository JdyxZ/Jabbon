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

    this.target = [0,0];
}

function Room( name, background)
{
    this.id= 0;
    this.name= name;
    this.background= background;
    this.people = [];
    this.range = [-100,100];
}

Room.prototype.addUser = function(user)
{
    this.people.push( user );
    user.room = this;
}

var WORLD = {
    rooms: {},
    users:{},
    room_count: 0,
    last_id_room: 0,

    createRoom:function (name, background)
    {
        var room = new Room( name, background);
        room.id = this.last_id_room ++;

        this.last_id_room ++ ;
        this.room_count ++ ;
        this.rooms[name] = room;

        return room;
    },

    createUser:function (name)
    {
        var user = new User(name);
        this.users[name] = user;

        return user;
    }
}


var MYAPP = {

    current_room: null,
    cam_offset: 0,
    myuser: null,
    scale_factor: 3,

    animations: {
        idle: [0],
        walking: [2,3,4,5,6,7,8,9],
        talking: [0,1]
    },

    init:function()
    {
        this.current_room = WORLD.createRoom("start","media/images/background.png");
        this.myuser = WORLD.createUser("eric");

        this.current_room.addUser(this.myuser);
    },

    draw:function(ctx, canvas)
    {
        //clear rect
        ctx.clearRect(0,0,canvas.width, canvas.height);

        //We save and apply some transformations to the scene
        ctx.save();
        ctx.translate( canvas.width/2, canvas.height/2 );
        ctx.scale(this.scale_factor,this.scale_factor);
        ctx.translate( this.cam_offset, 0 );

        if(this.current_room) this.drawRoom( ctx, this.current_room);

        //print rectangle in center
        // ctx.fillStyle = "red";
        // ctx.fillRect(-1,-1, 2, 2);

        //Always restore after a save
        ctx.restore();

    },

    //Here we apply a trasformation to a postion, from the screen to the world (with all the transformations)
    canvasToWorld(pos)
    {
        return [(pos[0] - canvas.width/2) / this.scale_factor - this.cam_offset, ( pos[1] - canvas.height/2) / this.scale_factor ]
    },

    drawRoom:function( ctx, room)
    {
        //Draw the room
        background = getImage(room.background);
        ctx.drawImage( background , background.width * this.scale_factor / -2, background.height * this.scale_factor / -2, background.width * this.scale_factor, background.height * this.scale_factor);

        //Draw all users in the room
        for(var i = 0; i < room.people.length; i++) this.drawUser(ctx, room.people[i]);
    },

    drawUser:function(ctx, user)
    {
        var img = getImage(user.avatar);

        //Check if the animation exists
        var anim = this.animations[user.animation];
        if(!anim) return;

        var time = performance.now() * 0.001;
        var frame = anim[Math.floor(time*12) % anim.length];

        //Or change all the scales or with a image editor modify all the images to have the same size more or less
        var scale = 1.5;
        ctx.drawImage( img, frame*32, user.facing*64,32,64, user.position - 15, -22 , 32, 64);

        //To have a debugg and see the line
        // ctx.strokeStyle = "white";
        // ctx.beginPath();
        // ctx.moveTo(user.position, 0);
        // ctx.lineTo(user.target[0], user.target[1]);
        // ctx.stroke();
    },

    update:function(dt)
    {
        //Check if the user is already created
        if(this.myuser)
        {
            var current_room = this.current_room;

            //Clamp the movement of the user
            this.myuser.target[0] = Clamp(this.myuser.target[0],current_room.range[0],current_room.range[1]);

            //To manage the movement of the avatar
            var diff = (this.myuser.target[0] - this.myuser.position);
            var delta = diff;
            if(delta > 0) 
            {
                this.myuser.facing = FACING_RIGHT;
                delta = 25;
            }
            else if(delta < 0) 
            {
                this.myuser.facing = FACING_LEFT;
                delta = -25;
            }
            else delta = 0;

            //When the avatar is almost at the target just put it there
            if( Math.abs(diff) < 1)
            {
                delta = 0
                this.myuser.position = this.myuser.target[0];
            } 
            else this.myuser.position += delta * dt;

            //If the difference between the target and the position of the avatar is not 0, the avatar is walking
            if(delta != 0) this.myuser.animation = "walking"
            else 
            {
                this.myuser.facing = FACING_FRONT;
                this.myuser.animation = "idle"
            }

            //To interpolate the movement of the cam
            this.cam_offset = Lerp( this.cam_offset, -this.myuser.position , 0.02);

        }

    },

    onMouse:function(e)
    {
        if(e.type == "mousedown")
        {
            var worldMouse = this.canvasToWorld(mouse_pos)
            this.myuser.target[0] = worldMouse[0];
            this.myuser.target[1] = worldMouse[1];
        }
        else if(e.type == "mousemove")
        {

        }
        else //mouseup
        {

        }
    }
}