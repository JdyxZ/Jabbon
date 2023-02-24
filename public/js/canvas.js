
/***************** VIEW *****************/

// HTML Elements
const canvas = document.getElementById('canvas');
// const exit = document.get('div[name="exit"]');
const logout_button = document.get("#logout-button"); 

// CSS variables
const available_height = window.screen.availHeight;
const available_width = window.screen.availWidth;
document.documentElement.style.setProperty('--screen_width', available_width + "px");
document.documentElement.style.setProperty('--screen_height', available_height + "px");

// Auxiliar elements
let last = performance.now(); //last stores timestamp from previous frame
let mouse_pos = [0,0];
let mouse_buttons = 0;
let imgs = {};

// Canvas variables
const canvas_offset = 20;
const canvas_left_boundary = -available_width/2 + VIEW.sprite_size.width;
const canvas_right_boundary = available_width/2 - VIEW.sprite_size.width;

function loop()
{
   // Update our canvas
   draw();

   // Compute elapsed time
   const now = performance.now();
   const elapsed_time = (now - last) / 1000; 

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
            return null;
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
    canvas.width = rect.width - canvas_offset;
    canvas.height = rect.height - canvas_offset;
    var ctx = canvas.getContext('2d');

    MYAPP.draw(canvas, ctx);
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

// Event listeners
document.body.addEventListener("mousedown", onMouse );
document.body.addEventListener("mousemove", onMouse );
document.body.addEventListener("mouseup", onMouse );

logout_button.when("keydown", () => {
    console.log(logout_button);
});

MYAPP.init();
