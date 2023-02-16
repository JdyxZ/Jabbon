
var login = {

    init: function()
    {
        //Log in data
        this.loginu = this.getSelector('input[name="username"]');
        this.loginp = this.getSelector('input[name="password"]');

        //button
        this.bttn = this.getSelector('#button');
        this.bttn.addEventListener("click", this.onLoginReady.bind(this));

        //label
        this.botlbl = this.getSelector('.change');
        this.botlbl.addEventListener("click", this.changeToSingUp.bind(this));

        //error panels
        this.pnl1 = this.getSelector('#pnl1');
        this.pnl2 = this.getSelector('#pnl2');
    },

    changeToSingUp: function()
    {
        alert("CARGAR VIEW LOG IN")
    },
    
    onLoginReady: function()
    {
        this.restorePanels();

        if(this.loginu.value.length > 0 && this.loginp.value.length > 0)
        {
            if(this.loginp.value.length < 8)
            {
                this.showErrors(1);
                return
            }
            else
                alert("Send data to the server");
                this.sendCredentials();
        }   
        else
        {
            this.showErrors(0);
            return
        }
    },  
    
    showErrors: function(type)
    {
        switch(type)
        {
            //Missing spots
            case 0:
            this.pnl2.style.display = "block";
            this.pnl2.innerHTML = "please fill the missing slots";
            if(this.loginu.value.length == 0) this.loginu.style.borderColor = "red";
            if(this.loginp.value.length == 0) this.loginp.style.borderColor = "red";
            break;

            //Small psword
            case 1:
            this.pnl2.style.display = "block";
            this.pnl2.innerHTML = "password must be 8 characters long at least";
            this.loginp.style.borderColor = "red";
            break;

            //Wrong credentials
            case 2:
            this.pnl2.style.display = "block";
            this.pnl2.innerHTML = "wrong credentials, try again with new ones";
            this.loginp.style.borderColor = "red";
        }

    },

    //Function to get the selector (easier code)
    getSelector: function(selector)
    {
        return document.querySelector(selector);
    },

    restorePanels: function()
    {
        this.loginu.style.borderColor = "#4a4c4c";
        this.loginp.style.borderColor = "#4a4c4c";
        this.pnl1.style.display = "none";
        this.pnl2.style.display = "none";
    },

    sendCredentials: function()
    {
        fetch('http://localhost:9014/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: this.loginu.value,
              password: this.loginp.value
            })
          })
          .then(response => {
            console.log('Server response:', response);
          })
          .catch(error => {
            console.error('Error sending data to server:', error);
          });
    }
}