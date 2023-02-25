//VIEW

var VIEW = {

    cam_offset: 0,
    scale_factor: 2,

    animations: {
        idle: [0],
        walking: [2,3,4,5,6,7,8,9],
        talking: [0,1]
    },

    sprite_size: {width: 32, height: 64},

    height: 10,

    init: function()
    {
        // TODO
    },

    draw: function(canvas, ctx, room, users, my_user)
    {
        // Clear rect
        ctx.clearRect(0,0, canvas.width, canvas.height);

        // We save and apply some transformations to the scene
        ctx.save();
        ctx.translate( canvas.width/2, canvas.height/2 );
        ctx.scale(this.scale_factor, this.scale_factor);
        ctx.translate( this.cam_offset, 0 );

        // Draw room and user of it
        this.drawRoom(ctx, room);
        this.drawUsers(ctx, users, my_user);

        // Always restore after a save
        ctx.restore();

    },

    // Here we apply a trasformation to a postion, from the screen to the world (with all the transformations)
    canvasToWorld(pos)
    {
        return [(pos[0] - canvas.width/2) / this.scale_factor - this.cam_offset, ( pos[1] - canvas.height/2) / this.scale_factor ]
    },

    drawRoom: function(ctx, room)
    {
        // Check
        if(!room)
            return;

        // Get background
        const background = getImage(room.background);

        // Draw the room
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage( background, background.width * this.scale_factor / -2, background.height * this.scale_factor / -2, background.width * this.scale_factor, background.height * this.scale_factor);
    },

    drawUsers: function(ctx, users, my_user)
    {
        // Draw other users
        users.forEach(user => this.drawUser(ctx, user));

        // Draw my user
        this.drawUser(ctx, my_user);
    },

    drawUser: function(ctx, user)
    {
        // Check user
        if(!user)
            return;
        
        // Check animation
        const anim = this.animations[user.animation];
        if(!anim) 
            return;

        // Get user sprite
        const sprite = getImage(user.avatar);

        // Get frame
        const time = performance.now() * 0.001;
        const frame = anim[Math.floor(time*12) % anim.length];

        // Or change all the scales or with an image editor modify all the images to have the same size more or less
        ctx.drawImage(
            sprite, 
            frame * this.sprite_size.width, // sprite x-offset
            user.facing * this.sprite_size.height, // sprite y-offset
            this.sprite_size.width, // sprite width
            this.sprite_size.height, // sprite height
            user.position, // x position of the canvas to draw in
            this.height, // y position of the canvas to draw in
            this.sprite_size.width * this.scale_factor, // x scale factor
            this.sprite_size.height * this.scale_factor // y scale factor
        );
        
        // Draw user label
        this.drawUserLabel(ctx, user);
    },

    drawUserLabel: function(ctx, user) 
    {
        // Save context
        ctx.save();

        // Let font
        let font = "8px Arial";
        ctx.font = font;
    
        // Draw text from top - makes life easier at the moment
        ctx.textBaseline = 'top';
    
        // Color for background
        ctx.fillStyle = '#000000';
        
        // Get text and width of text
        const txt = user.name;
        var width = ctx.measureText(txt).width;

        // Set background margin
        const horizontal_margin = 10;
        const vertical_margin = 10;

        // Compute text position
        const x = user.position + this.sprite_size.width - (width + horizontal_margin) / 2 - 2;
        const y = (this.height + vertical_margin) - 30;
    
        // Draw background rect assuming height of font
        ctx.beginPath();
        ctx.roundRect(x, y, width + horizontal_margin, parseInt(font, 10) + vertical_margin, 5);
        ctx.fill();
        ctx.stroke();

        // Set bold font to canvas
        ctx.font = "bold 8px Arial";
        
        // Text color
        ctx.fillStyle = '#FFFFFF';
    
        // Draw text on top
        ctx.fillText(txt, x + horizontal_margin/2, y + vertical_margin/2);

        // Save restire context
        ctx.restore();
    }

}