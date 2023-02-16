//VIEW

var VIEW = {

    
    cam_offset: 0,
    scale_factor: 3,

    animations: {
        idle: [0],
        walking: [2,3,4,5,6,7,8,9],
        talking: [0,1]
    },

    init: function(){

    },

    draw:function(canvas, ctx, room)
    {
        //clear rect
        ctx.clearRect(0,0,canvas.width, canvas.height);

        //We save and apply some transformations to the scene
        ctx.save();
        ctx.translate( canvas.width/2, canvas.height/2 );
        ctx.scale(this.scale_factor,this.scale_factor);
        ctx.translate( this.cam_offset, 0 );

        if(room) this.drawRoom( ctx, room);

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
        for(var i = 0; i < room.people.length; i++) this.drawUser(ctx, WORLD.getUser(room.people[i]));
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
        ctx.drawImage( img, frame*32, user.facing*64,32,64, user.position, -22 , 32, 64);

        //To have a debugg and see the line
        // ctx.strokeStyle = "white";
        // ctx.beginPath();
        // ctx.moveTo(user.position, 0);
        // ctx.lineTo(user.target[0], user.target[1]);
        // ctx.stroke();
    },

}