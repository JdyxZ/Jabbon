/***************** CONTROLLER *****************/

var MYAPP = {

    current_room: null,
    myuser: null,

    init: function()
    {
        fetch("rooms.json")
        .then(function(resp){ return resp.json(); })
        .then(function(json){
             WORLD.fromJSON(json);
             MYAPP.onWorldLoaded();
            });
            
        // TEST MODEL
        // this.current_room = WORLD.createRoom("start","media/images/background.png");
        // this.myuser = WORLD.createUser("eric");

        // this.current_room.addUser(this.myuser, null, null, null, null, null, null);

        //INIT
        VIEW.init();
        CLIENT.init();
    },

    onWorldLoaded:function()
    {
        this.current_room = WORLD.rooms[WORLD.default_room];
    },

    draw: function(canvas,ctx) {

        VIEW.draw(canvas,ctx,this.current_room)

    },

    update:function(dt)
    {
        //Check if the user is already created
        if(this.myuser)
        {
            this.updateUser(this.myuser,dt);
        }

    },

    updateUser:function(user,dt)
    {
        var current_room = this.current_room;

            //Clamp the movement of the user
            user.target[0] = user.target[0].clamp(current_room.range[0],current_room.range[1]);

            //To manage the movement of the avatar
            var diff = (user.target[0] - user.position);
            var delta = diff;
            if(delta > 0) 
            {
                user.facing = FACING_RIGHT;
                delta = 25;
            }
            else if(delta < 0) 
            {
                user.facing = FACING_LEFT;
                delta = -25;
            }
            else delta = 0;

            //When the avatar is almost at the target just put it there
            if( Math.abs(diff) < 1)
            {
                delta = 0
                user.position = user.target[0];
            } 
            else user.position += delta * dt;

            //If the difference between the target and the position of the avatar is not 0, the avatar is walking
            if(delta != 0) user.animation = "walking"
            else 
            {
                user.facing = FACING_FRONT;
                user.animation = "idle"
            }

            //To interpolate the movement of the cam
            VIEW.cam_offset = VIEW.cam_offset.lerp(-user.position , 0.02);
    },

    onMouse:function(e)
    {
        if(e.type == "mousedown")
        {
            var worldMouse = VIEW.canvasToWorld(mouse_pos)
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