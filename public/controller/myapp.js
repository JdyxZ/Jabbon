/***************** CONTROLLER *****************/

var MYAPP = {

    current_room: null,
    myuser: null,
    users: [],

    init: function()
    {
        //INIT
        VIEW.init();
        CLIENT.init();
    },

    getIDByUserID:function(_id)
    {
        for(i = 0; i < this.users.length; i++)
        {
            if(this.users[i].id == _id) return i;
        }
    },

    onWorldLoaded:function()
    {
        this.current_room = WORLD.rooms[WORLD.default_room];
    },

    draw: function(canvas,ctx) {
        VIEW.draw(canvas,ctx,this.current_room);
    },

    update:function(dt)
    {
        this.users.forEach(user => this.updateUser(user,dt));
    },

    updateUser:function(user,dt)
    {
        var current_room = this.current_room;

            //There is something wrong with the position of the user when you change tabs, so this is just a temporary fix
            if(!(user.position >current_room.range[1] || user.position < current_room.range[0]))
            {
                //Clamp the movement of the user
                if(user.target[0])
                {
                    user.target[0] = user.target[0].clamp(current_room.range[0],current_room.range[1]);
                    //To manage the movement of the avatar
                    var diff = (user.target[0] - user.position);
                    var delta = diff;
                    if(delta > 0) 
                    {
                        user.facing = FACING_RIGHT;
                        delta = 50;
                    }
                    else if(delta < 0) 
                    {
                        user.facing = FACING_LEFT;
                        delta = -50;
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
                        user.animation = "idle";
                    }
                    if(current_room) current_room.exits.forEach(function(exit_) {
                        if(user.position < exit_[1] + 50) exit.style.display = "block";
                        else exit.style.display = "none";
                    });
                    

                    //To interpolate the movement of the cam
                    VIEW.cam_offset = VIEW.cam_offset.lerp(-user.position , 0.02);
                } 

                
            }
            else
            {
                if(user.position > current_room.range[1]) user.position = current_room.range[1];
                if(user.position < current_room.range[0]) user.position = current_room.range[0];
            }
    },

    onMouse:function(e)
    {
        if(e.type == "mousedown")
        {
            var worldMouse = VIEW.canvasToWorld(mouse_pos)
            this.myuser.target[0] = worldMouse[0];
            this.myuser.target[1] = worldMouse[1];
            const message = new Message(this.myuser.id,"TICK",{"target":this.myuser.target},getTime());
            CLIENT.sendRoomMessage(message);
        }
        else if(e.type == "mousemove")
        {

        }
        else //mouseup
        {

        }
    },

    leave: function() {
        console.log(MYAPP.current_room);
        if(MYAPP.current_room) 
        {
            
            const exit = MYAPP.current_room.exits.forEach(function(exit_) 
            {
                return exit_
                if(MYAPP.myuser.position < exit_[1] + 50) return exit_
            });
            console.log(MYAPP.myuser.id);
            const message = new Message(MYAPP.myuser.id,"EXIT",{ "exit": JSON.stringify(MYAPP.current_room.exits[0]) , "room": MYAPP.current_room },getTime());
            CLIENT.sendRoomMessage(message);

        }
        
    }
    
}