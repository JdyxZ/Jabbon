var signup = {

    init: function()
    {
        //Log in data
        this.signupu = this.getSelector('#username');
        this.signupp1 = this.getSelector('.password1');
        this.signupp2 = this.getSelector('.password2');

        // Key down
        this.signupu.addEventListener("keydown", this.onKeyDown.bind(this));
        this.signupp1.addEventListener("keydown", this.onKeyDown.bind(this));
        this.signupp2.addEventListener("keydown", this.onKeyDown.bind(this));
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
    }
    
}