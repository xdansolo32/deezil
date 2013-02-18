Ext.define('Diesel.controller.Login', {
	extend: 'Ext.app.Controller',

        config: {
            control: {
                loginButton:{
		    tap: 'doLogin'
		}
	    },
	    refs: {
                loginText: 'fieldset',
	        loginButton: 'button'
	    }
	},

	doLogin: function() {
            var name = '';
	    // Login using fb
            FB.login(function(resp) {
		    if(resp.authResponse) {
			// connected
                        FB.api('/me', function(resp) {
				console.log('Welcome '+ resp.name + '.');
 		        });
		    } else {
			// cancelled
		    }
  	    });
	},
});