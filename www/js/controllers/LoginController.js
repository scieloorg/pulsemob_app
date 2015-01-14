var LoginController = function() {
};

LoginController.prototype = {
    initialize: function() {
        LoginController.initListeners();
    },
    destroy: function() {
        PageLoad.ajxHandle = null;
    }
};

LoginController.initListeners = function(){
    document.getElementById('btn-login-facebook').addEventListener('tap',LoginController.loginFacebook, false);
    document.getElementById('btn-login-google').addEventListener('tap',LoginController.loginGoogle, false);
};

LoginController.loginFacebook = function(){
    Navigator.loadPage("home.html");
};

LoginController.loginGoogle = function(){
    Navigator.loadPage("home.html");
};