
var login {

    init: function()
    {
        //Log in data
        this.loginu = this.getSelector('input[name="lusername"]');
        this.loginp = this.getSelector('input[name="lpassword"]');

        //Sign up data
        this.signupu = this.getSelector('input[name="susername"]');
        this.signupp1 = this.getSelector('input[name="spassword1"]');
        this.signupp2 = this.getSelector('input[name="spassword2"]');

        //button
        this.bttn = this.getSelector('#button');

        //labels
        this.toplbl = this.getSelector('.label');
        this.botlbl = this.getSelector('.change');
    },

    changeToSingUp: function()
    {
        alert(this.toplbl.value)
    },

    changeToLogIn: function()
    {

    },

    //Function to get the selector (easier code)
    getSelector: function(selector)
    {
        return document.querySelector(selector);
    },
}