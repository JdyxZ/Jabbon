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
        VIEW.draw(canvas, ctx, this.current_room, this.users_arr, this.my_user);
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

        // Temporal fix: Clamp player position in case there is something wrong  when you change tabs
        user.position = user.position.clamp(this.current_room.range[0], this.current_room.range[1])
        
        // Clamp the movement of the user
        user.target[0] = user.target[0].clamp(this.current_room.range[0], this.current_room.range[1]);

        // Declare some vars
        const diff = (user.target[0] - user.position);
        let delta = diff;

        // Manage the movement of the avatar
        if(delta != 0) 
        {
            // If the difference between the target and the position of the avatar is not 0, the avatar is walking
            user.animation = "walking";

            if(delta > 0) 
            {
                user.facing = FACING_RIGHT;
                delta = 40;
            }
            else
            {
                user.facing = FACING_LEFT;
                delta = -40;
            }
        }
        else
        {
            user.animation = "idle";
            user.facing = FACING_FRONT;
            delta = 0;
        }

        // When the avatar is almost at the target just place it there
        if( Math.abs(diff) < 1)
        {
            delta = 0
            user.position = user.target[0];
        } 
        else
        {
            user.position += delta * dt;
        } 

        // Camera motion vars
        const new_camera_focus = 
            user.position < canvas_left_boundary ? -(user.position - canvas_left_boundary) : 
            user.position > canvas_right_boundary ? -(user.position - canvas_right_boundary) :
            0;
        
        // Lerp camera position
        VIEW.cam_offset = VIEW.cam_offset.lerp(new_camera_focus, 0.02);
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