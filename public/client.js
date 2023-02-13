

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

    onMessage: function(message)
    {
        // Process message
        if(message.data.includes("ERROR"))
            console.log(message.data);
        else
        {
            const obj = JSON.parse(message.data);
            console.log("New message received: ", obj);
        }
    },

    onOpen: function()
    {
        console.log("Connecting!");
    },

    onClose: function()
    {
        console.log("Disconnecting!");
    }

}