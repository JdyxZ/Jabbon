
var login = {

    init: function()
    {
        // Log in data
        this.loginu = this.getSelector('#username');
        this.loginp = this.getSelector('#password');

        // Key down
        this.loginu.addEventListener("keydown", this.onKeyDown.bind(this));
        this.loginp.addEventListener("keydown", this.onKeyDown.bind(this));
    },

    onKeyDown: function(event)
    {
        const alert = document.querySelector(".alert");
        if(alert)
        {
            console.log("here");
            alert.hide();
        }
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
    },

    switchToSign: function()
    {
        fetch('http://localhost:9014/LOGIN', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              type: "signup"
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