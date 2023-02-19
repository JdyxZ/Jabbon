var signup = {

    init: function()
    {
        //Log in data
        this.signupu = this.getSelector('input[name="username"]');
        this.signupp1 = this.getSelector('input[name="password1"]');
        this.signupp2 = this.getSelector('input[name="password2"]');

        //button
        this.bttn = this.getSelector('#button');
        this.bttn.addEventListener("click", this.onSignUpReady.bind(this));

        //error panels
        this.pnl1 = this.getSelector('#pnl1');
        this.pnl2 = this.getSelector('#pnl2');
    },
    
    onSignUpReady: function()
    {
        this.restorePanels();

        if(this.signupu.value.length > 0 && this.signupp1.value.length > 0 && this.signupp2.value.length > 0)
        {
            if(this.signupp1.value.length < 8 || this.signupp2.value.length < 8)
            {
                this.showErrors(1);
                return
            }
            else
            {
                if (this.signupp1.value == this.signupp2.value)
                {
                    alert("Send data to the server");
                    this.sendCredentials()
                }      
                else
                {
                    this.showErrors(2);
                    return
                }
            }        
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
            if(this.signupu.value.length == 0) this.signupu.style.borderColor = "red";
            if(this.signupp1.value.length == 0) this.signupp1.style.borderColor = "red";
            if(this.signupp2.value.length == 0) this.signupp2.style.borderColor = "red";
            break;

            //Small psword
            case 1:
            this.pnl2.style.display = "block";
            this.pnl2.innerHTML = "password must be 8 characters long at least";
            this.signupp1.style.borderColor = "red";
            this.signupp2.style.borderColor = "red";
            break;

            //Passwords don't match
            case 2:
            this.pnl2.style.display = "block";
            this.pnl2.innerHTML = "passwords must match";
            this.signupp1.style.borderColor = "red";
            this.signupp2.style.borderColor = "red";
            break;
            
            //Username already exists
            case 3:
            this.pnl2.style.display = "block";
            this.pnl2.innerHTML = "username with this name already exists, try a new one";
            this.signupu.style.borderColor = "red";
            break;
        }

    },

    //Function to get the selector (easier code)
    getSelector: function(selector)
    {
        return document.querySelector(selector);
    },

    restorePanels: function()
    {
        this.signupu.style.borderColor = "#4a4c4c";
        this.signupp1.style.borderColor = "#4a4c4c";
        this.signupp2.style.borderColor = "#4a4c4c";
        this.pnl1.style.display = "none";
        this.pnl2.style.display = "none";
    },
    
    sendCredentials: function()
    {
        fetch('http://localhost:9014/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: this.signupu.value,
              password: this.signupp1.value
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