
/***************** VIEW *****************/

var canvas = document.getElementById('canvas');
var last = performance.now();
var mouse_pos = [0,0];
var mouse_buttons = 0;
var imgs = {};
var exit = document.get('input[name="exit"]');

//last stores timestamp from previous frame

function loop()
{
   // Update our canvas
   draw();
   // Compute elapsed time
   var now = performance.now();
   var elapsed_time = (now - last) / 1000; 

   // Update last time
   last = now;

   // Update model
   update( elapsed_time );

   // Request to call loop() again before next frame
   requestAnimationFrame( loop );
}

// Start loop
loop();

//Fetch image
async function fetchImage(url)
{
    try
    {
        // Fetch image from url    
        const response = await fetch(url, {method: "GET"}); 
    
        // Check response
        if (response.status !== 200) {
            console.log(`HTTP-Error ${response.satus} upon fetching url ${url} `);
        };
            
        // Convert response into binary image
        const imageBlob = await response.blob()

        // Create a local URL for the image
        const imageObjectURL = URL.createObjectURL(imageBlob);

        // Create image and attach url
        const img = new Image();
        img.src = imageObjectURL;

        // Return image
        return img;
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

// Image manager
function getImage(url)
{
	// If the image is already loaded return it
	if(imgs[url])
		return imgs[url];
    
	// Create new image and attach url
    const img = imgs[url] = document.createElement("img");
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
