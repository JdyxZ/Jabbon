
/***************** VIEW *****************/

var canvas = document.getElementById('canvas');
var last = performance.now();
var mouse_pos = [0,0];
var mouse_buttons = 0;
var imgs = {};


//last stores timestamp from previous frame


function loop()
{
   //update our canvas
   draw();

   //to compute seconds since last loop
   var now = performance.now();
   //compute difference and convert to seconds
   var elapsed_time = (now - last) / 1000; 
   //store current time into last time
   last = now;

   //now we can execute our update method
   update( elapsed_time );

   //request to call loop() again before next frame
   requestAnimationFrame( loop );
}

//start loop
loop();

//example of images manager
function getImage(url)
{
	//check if already loaded
	if(imgs[url])
		return imgs[url];


	//if no loaded, load and store
	var img = imgs[url] = new Image();
	img.src = url;
	return img;
}

function draw() {
    var parent = canvas.parentNode;
    var rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    var ctx = canvas.getContext('2d');

    MYAPP.draw(canvas,ctx);
}

function update(dt)
{
    MYAPP.update(dt);

}

function onMouse( e ) { 

   var rect = canvas.getBoundingClientRect();
   var canvasx = mouse_pos[0] = e.clientX - rect.left;
   var canvasy = mouse_pos[1] = e.clientY - rect.top;
   mouse_buttons = e.buttons;

   MYAPP.onMouse(e);
};

document.body.addEventListener("mousedown", onMouse );
document.body.addEventListener("mousemove", onMouse );
document.body.addEventListener("mouseup", onMouse );


MYAPP.init();
