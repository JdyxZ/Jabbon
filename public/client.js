

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
                console.log(`New PROFILE message received: ${message.content}`);
                break;
            case "ERROR":
                console.log(obj.content);
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
    sendMessage: function(sender, type, content, date)
    {
        // Build message
        if (date == null) date = (new Date()).getTime();
        let message = new model.Message(sender, type, content, date);

        // Appned addresses to the message
        message.addressees = [];

        // Send message to user
        this.socket.sendUTF(JSON.stringify(message));
    },

    sendMessage: function(sender, type, content, date, addressees)
    {
        // Build message
        if (date == null) date = (new Date()).getTime();
        let message = new model.Message(sender, type, content, date);

        // Appned addresses to the message
        message.addressees = addressees;

        // Send message to user
        this.socket.sendUTF(JSON.stringify(message));
    }

}