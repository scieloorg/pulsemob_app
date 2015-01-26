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
    window.plugins.googleplus.login(
        {
          'iOSApiKey': '93947435572-m1f1gob6teg651c88m5ibrv00d2ls35v.apps.googleusercontent.com'
        },
        function (obj) {
            
            console.log(JSON.stringify(obj));
            
            console.log(obj.userId);
            console.log(obj.idToken);
            
            alert('aeee');
        },
        function (msg) {
            App.hideLoadingScreen();
            App.showModal("Erro", "Falha ao realizar login, por favor verifique a sua conexão com a internet.");
        }
    );
};