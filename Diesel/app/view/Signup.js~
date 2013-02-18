Ext.define('Diesel.view.Signup', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',

    config: {

        tabBarPosition: 'bottom',

        items: [
            {
                id: 'loginForm',
                title: 'Login',
                iconCls: 'home',
                xtype: 'formpanel',
                url: 'contact.php',
                layout: 'vbox',

                items: [
                   {
                        xtype: 'fieldset',
                        title: 'Login',
                        items: [
                            {
                                xtype: 'emailfield',
                                label: 'Email'
                            },
                            {
                                xtype: 'passwordfield',
                                label: 'Password'
                            }
                        ]
                   },
                   {
                        xtype: 'button',
                        text: 'Send',
                        ui: 'confirm',
                        handler: function() {
			   this.up('formpanel').submit();
                        }
                    }
                ]
            }
        ]
    }
});