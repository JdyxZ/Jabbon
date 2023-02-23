/***************** CONTROLLER *****************/

var MYAPP = {

    current_room: null,
    my_user: null,
    users_obj: {},
    users_arr: [],

    init: function()
    {
        // INIT
        CLIENT.init();
        VIEW.init();
    },

    draw: function(canvas,ctx) 
    {
        VIEW.draw(canvas,ctx, this.current_room, this.users_arr, this.my_user);
    },

    update:function(dt)
    {
        // Update other users
        if(this.users_arr.length > 0)
            this.users_arr.forEach(user => this.updateUser(user, dt));

        // Update my user
        this.updateUser(this.my_user, dt);

    },

    updateUser:function(user, dt)
    {
        // Avoid nesting
        if(!this.current_room || !user)
            return;

        // Check user position
        const left_range = user.position < this.current_room.range[0];
        const right_range = user.position > this.current_room.range[1];

        // There is something wrong with the position of the user when you change tabs, so this is just a temporary fix
        if(left_range || right_range)
        {
            if(left_range) user.position = this.current_room.range[0];
            if(right_range) user.position = this.current_room.range[1];
            return;
        }
        
        // Clamp the movement of the user
        user.target[0] = user.target[0].clamp(this.current_room.range[0], this.current_room.range[1]);

        // To manage the movement of the avatar
        var diff = (user.target[0] - user.position);
        var delta = diff;
        if(delta > 0) 
        {
            user.facing = FACING_RIGHT;
            delta = 40;
        }
        else if(delta < 0) 
        {
            user.facing = FACING_LEFT;
            delta = -40;
        }
        else delta = 0;

        // When the avatar is almost at the target just put it there
        if( Math.abs(diff) < 1)
        {
            delta = 0
            user.position = user.target[0];
        } 
        else user.position += delta * dt;

        // If the difference between the target and the position of the avatar is not 0, the avatar is walking
        if(delta != 0) user.animation = "walking"
        else 
        {
            user.facing = FACING_FRONT;
            user.animation = "idle"
        }
        if(user.position )

        // To interpolate the movement of the cam
        VIEW.cam_offset = VIEW.cam_offset.lerp(-user.position, 0.02);
    },

    onMouse:function(e)
    {
        if(e.type == "mousedown")
        {
            var worldMouse = VIEW.canvasToWorld(mouse_pos)
            this.my_user.target[0] = worldMouse[0];
            this.my_user.target[1] = worldMouse[1];
            const message = new Message(this.my_user.id,"TICK", {"target":this.my_user.target}, getTime());
            CLIENT.sendRoomMessage(message);
        }
        else if(e.type == "mousemove")
        {

        }
        else //mouseup
        {

        }
    }
}