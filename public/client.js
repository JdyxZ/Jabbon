

/***************** CLIENT *****************/
var CLIENT =
{
    // Client data
    port: 9014,
    socket: null,
    debug: null,
    
    init: function()
    {
        // New WebSocket instance
        this.socket = new WebSocket(`ws://localhost:${this.port}`);

        // Callbacks
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    },

    // WebSocket callbacks
    onMessage: function(ws_message)
    {
        // Process message
        const message = JSON.parse(ws_message.data);

        switch(message.type)
        {
            case "TEXT":
                console.log(`New TEXT message received: ${message.content}`);
                break;
            case "TYPING":
                console.log(`New TYPING message received: ${message.content}`);
                break;
            case "PROFILE":
                //user_list
                console.log(`New PROFILE message received: ${message.content}`);
                MYAPP.user_list.push(message.content);
                break;
            case "ERROR":
                console.log(obj.content);
                break;
            case "ENTER":
                console.log(`New USER in the room: ${message.content}`);
                MYAPP.user_list.push(message.content);
                MYAPP.myuser = message.content;
                break;
            case "LEAVE":
                console.log(`User LEAVED the room: ${message.content}`);
                WORLD.removeUser(JSON.stringify(message.content));
                break;
        }        
        
    },

    onOpen: function()
    {
        console.log("Connecting!");
    },

    onClose: function()
    {
        console.log("Disconnecting!");
    },

    // Methods
    sendRoomMessage: function(message)
    {
        // Append addresses to the message
        message.addressees = [];

        // Send message to user
        this.socket.sendUTF(JSON.stringify(message));
    },

    sendPrivateMessage: function(message, addressees)
    {
        // Check addressees
        if (!addressees instanceof Array)
        {
            console.error("The addressees of your message must be an array of ids");
            return;
        }

        // Append addresses to the message
        message.addressees = addressees;

        // Send message to user
        this.socket.sendUTF(JSON.stringify(message));
    }

}