
/***************** VIEW *****************/

// HTML Elements
const canvas = document.get('#Jabbon canvas');
// const exit = document.get('div[name="exit"]');
const chat = document.get("#Jabbon #chat");
const room_name = chat.get(".banner .room-name");
const room_people = chat.get(".banner .room-people");
const conversation = chat.get("#conversation .fix");
const new_user_message_template = document.get("#Jabbon #new-user-message-template");
const concurrent_user_message_template = document.get("#Jabbon #concurrent-user-message-template");
const chat_input = document.get("#Jabbon #keyboard-input");
const logout_button = document.get("#Jabbon #logout-button"); 

// CSS variables
const available_height = window.screen.availHeight;
const available_width = window.screen.availWidth;
document.documentElement.style.setProperty('--screen_width', available_width + "px");
document.documentElement.style.setProperty('--screen_height', available_height + "px");

// Auxiliar vars
let last = performance.now(); //last stores timestamp from previous frame
let last_sender = null;
let mouse_pos = [0,0];
let mouse_buttons = 0;
let imgs = {};

// Canvas variables
const canvas_offset = 20;
const canvas_left_boundary = -available_width/2 + VIEW.sprite_size.width;
const canvas_right_boundary = available_width/2 - VIEW.sprite_size.width;

// Event listeners
canvas.addEventListener("mousedown", onMouse );
canvas.addEventListener("mousemove", onMouse );
canvas.addEventListener("mouseup", onMouse );
chat_input.addEventListener("keydown", onChatInput);

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

function onMouse(e) 
{ 
   var rect = canvas.getBoundingClientRect();
   var canvasx = mouse_pos[0] = e.clientX - rect.left;
   var canvasy = mouse_pos[1] = e.clientY - rect.top;
   mouse_buttons = e.buttons;

   MYAPP.onMouse(e);
};

function onChatInput(e)
{
    // Check
    if (e.code != "Enter" || chat_input.value.length == 0)
        return;

    // Get some vars
    const user_id = MYAPP.my_user.id;
    const user_name = MYAPP.my_user.name;

    // Get layout type
    let layout_type;
    switch(true)
    {
        case last_sender == null:
            layout_type = "new";
            break;
        case last_sender == user_id:
            layout_type = "concurrent";
            break;
        default:
            layout_type = "new";
            break;
    }

    // Fetch and clone proper message template
    const message_template = layout_type == "new" ? new_user_message_template : concurrent_user_message_template;
    let message_box = message_template.cloneNode(true);
    
    // Style message to make it look like a user message


    switch(true)
    {
        case layout_type == "new":
            message_box.style.margin = "0% 5% 0% auto";
            message_box.get(".message .username").remove();
            message_box.get(".message").style.background = 'var(--user-message)';
            message_box.get(".message").style.margin = '0% 15px 15px auto';
            message_box.get(".message").style.borderRadius = '8px 0px 8px 8px';
            break;
        case layout_type == "concurrent":
            message_box.style.background = 'var(--user-message)';
            message_box.style.margin = '0% 15px 15px auto';
            message_box.style.borderRadius = '8px 0px 8px 8px';
            break;
    }


    // Set message contents
    message_box.get(".message-content").innerText = chat_input.value;
    message_box.get(".message-time").innerText = getTime();

    // Add template to the DOM
    layout_type == "new" ? conversation.appendChild(message_box) : conversation.lastElementChild.appendChild(message_box);

    //Delete template old attributes
    message_box.removeAttribute('id');

    // Show new message
    message_box.show();

    //Update scrollbar focus
    message_box.scrollIntoView();		

    // Build message
    const message = new Message(user_id, "PUBLIC", chat_input.value, getTime());

    // Send message
    CLIENT.sendRoomMessage(message);

    // Reset chat input
    chat_input.value = '';

    // Update last sender id
    last_sender = user_id;
}

function setRoomPeople()
{
    // Aux var
    let people = 'You, ';

    // Set room people into the chat
    MYAPP.users_arr.forEach(user =>{
        people += `${user.name}, `;
    })

    // Delete last cooma
    room_people.innerText = people.slice(0, people.length - 2);
}

MYAPP.init();
