var LoginController = function() {
};

LoginController.USER_KEY = "SCIELO_USER";
LoginController.IOS_API_KEY = "903038984767-9ngq0ut4esd5247kd3oog8jimnab1n9e.apps.googleusercontent.com";

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

    facebookConnectPlugin.login(["public_profile"], 
        function(response){
            var facebookid = response.authResponse.userID;
            var token = response.authResponse.accessToken;

            facebookConnectPlugin.api(facebookid + "/?fields=email, name", ["public_profile"],
                function(responseAPI){
                    var name = responseAPI.name;
                    var email = responseAPI.email;

                    $.ajaxSetup({
                        headers: { facebookid: facebookid, googleid: undefined, token: token }
                    });

                    var user = new User();
                    
                    user.name = name;
                    user.email = email;
                    user.language = "EN";
                    user.font_size = "M";
                    user.facebook_id = facebookid;
                    user.token = token;
                    
                    var userData = {name: user.name, email: user.email, language: user.language, font_size: user.font_size};

                    Service.login(userData, function(data){
                        if (data !== false){
                            user.updateFromLoginData(data);
                            
                            SciELO.saveCache(LoginController.USER_KEY, user, false);
                            Navigator.loadPage("home.html");
                        }else{
                            alert ("Error on server request.");
                        }
                    });
                },
                function(err){
                    // Error getting information.
                    alert('Error getting information.');
                });
        }, function(err){
            alert('Login error.');
        });
};

LoginController.autoLogin = function(){
    if (SciELO.hasCache(LoginController.USER_KEY, false)){
        var cachedUser = User(SciELO.getCacheData(LoginController.USER_KEY, false));
        if (cachedUser.facebook_id !== null){
            LoginController.autoLoginFacebook(cachedUser);
        }else if (cachedUser.google_id !== null){
            LoginController.autoLoginGoogle(cachedUser);
        }else{
            SciELO.removeCache(LoginController.USER_KEY);
            Navigator.loadFullPage("login.html");
        }
    }else{
        Navigator.loadFullPage("login.html");
    }
};

LoginController.autoLoginFacebook = function(cachedUser){
    facebookConnectPlugin.getLoginStatus(
            function (response) {
                if (response.status === "connected" && cachedUser.facebook_id === response.authResponse.userID) {
                    var userData = {name: cachedUser.name, email: cachedUser.email, language: cachedUser.language, font_size: cachedUser.font_size};
                    
                    $.ajaxSetup({
                        headers: { facebookid: cachedUser.facebook_id, googleid: undefined, token: cachedUser.token }
                    });
                    
                    Service.login(userData, function (data) {
                        if (data !== false) {
                            cachedUser.updateFromLoginData(data);
                            Navigator.loadPage("home.html");
                        } else {
                            Navigator.loadFullPage("login.html");
                        }
                    });
                } else {
                    Navigator.loadFullPage("login.html");
                }
            },
            function (err) {
                SciELO.removeCache(LoginController.USER_KEY);
                Navigator.loadFullPage("login.html");
            });
};

LoginController.loginGoogle = function(){
    window.plugins.googleplus.login(
        {
          iOSApiKey: LoginController.IOS_API_KEY
        },
        function (obj) {
            var user = new User();
            
            user.name = obj.displayName;
            user.email = obj.email;
            user.google_id = obj.userId;
            user.token = obj.idToken;
            user.language = "EN";
            user.font_size = "M";
            
            $.ajaxSetup({
                headers: { googleid: user.google_id, facebookid: undefined, token: user.token }
            });
            
            var userData = {name: user.name, email: user.email, language: user.language, font_size: user.font_size};

            Service.login(userData, function(data){
                if (data !== false){
                    SciELO.saveCache(LoginController.USER_KEY, user, false);
                    user.updateFromLoginData(data);
                    Navigator.loadPage("home.html");
                }else{
                    App.showCommonDialog("ERROR", "Error on server request.", false);
                    Navigator.loadFullPage("login.html");
                }
            });
        },
        function (msg) {
            App.hideLoadingScreen();
            App.showCommonDialog("ERROR", "Login failed. (" + msg + ")", false);
            Navigator.loadFullPage("login.html");
        }
    );
};

LoginController.autoLoginGoogle = function (cachedUser) {
    window.plugins.googleplus.trySilentLogin(
            {
                iOSApiKey: LoginController.IOS_API_KEY
            },
    function (obj) {
        if (obj.userId === cachedUser.google_id) {
            var userData = {name: cachedUser.name, email: cachedUser.email, language: cachedUser.language, font_size: cachedUser.font_size};
            
            $.ajaxSetup({
                headers: { googleid: cachedUser.google_id, facebookid: undefined, token: cachedUser.token }
            });
            
            Service.login(userData, function (data) {
                if (data !== false) {
                    cachedUser.updateFromLoginData(data);
                    Navigator.loadPage("home.html");
                } else {
                    App.showCommonDialog("ERROR", "Error on server request.", false);
                    Navigator.loadFullPage("login.html");
                }
            });
        }else{
            Navigator.loadFullPage("login.html");
        }
    },
            function (msg) {
                SciELO.removeCache(LoginController.USER_KEY);
                Navigator.loadFullPage("login.html");
            }
    );
};