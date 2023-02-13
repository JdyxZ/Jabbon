

/***************** CLIENT *****************/
var CLIENT =
{
    // Client data
    port: 9014,
    socket: null,
    
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
        console.log(`New message received: ${message}`);
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