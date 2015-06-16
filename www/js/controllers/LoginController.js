var LoginController = function () {
};

LoginController.USER_TYPE_KEY = "SCIELO_USER_TYPE";
LoginController.FACEBOOK = "FACEBOOK";
LoginController.GOOGLE = "GOOGLE";
LoginController.IOS_API_KEY = "903038984767-jmg2ov4lvfc5p8k214smfp3bkjv4gcm8.apps.googleusercontent.com";
LoginController.prototype = {
    initialize: function () {
        LoginController.initListeners();
        App.trackView("Login");
    },
    destroy: function () {
        PageLoad.ajxHandle = null;
    }
};

LoginController.initListeners = function () {
    $("#btn-login-facebook").on('tap', LoginController.loginFacebook);
    $("#btn-login-google").on('tap', LoginController.loginGoogle);
};

LoginController.loginFacebook = function () {
    
    console.log("ENTREI NO FACEBOOK LOGIN!!!");

    facebookConnectPlugin.login(["public_profile", "email"],
        function (response) {
            App.showLoadingScreen();
            var facebookid = response.authResponse.userID;
            var token = response.authResponse.accessToken;

            facebookConnectPlugin.api(facebookid + "/?fields=email,name", ["public_profile"],
                    function (responseAPI) {

                        if($.ajaxSettings.headers && $.ajaxSettings.headers["googleid"]) delete $.ajaxSettings.headers["googleid"];

                        $.ajaxSetup({
                            headers: {facebookid: facebookid, token: token}
                        });

                        var userData = {name: responseAPI.name, email: responseAPI.email, language: App.locale, font_size: "S"};

                        $.when(
                                Service.login(userData)
                                ).then(
                                function (data) {
                                    SciELO.saveCache(LoginController.USER_TYPE_KEY, LoginController.FACEBOOK, false);
                                    Navigator.loadPage("home.html");
                                    App.hideLoadingScreen();
                                },
                                function () {
                                    App.hideLoadingScreen();
                                    App.showCommonDialog("SciELO", Localization.getAppValue("error-login"), function(){
                                        Navigator.loadFullPage("login.html");
                                    });
                                }
                        );
                    },
                    function (err) {
                        App.trackException("Error api facebook: "+JSON.stringify(err));
                        App.hideLoadingScreen();
                        App.showCommonDialog("SciELO",Localization.getAppValue("error-facebook"), function(){
                            Navigator.loadFullPage("login.html");
                        });
                    });
        }, function (err) {
            App.trackException("Error login facebook: "+JSON.stringify(err));
            App.showCommonDialog("SciELO",Localization.getAppValue("error-facebook"), function(){
                Navigator.loadFullPage("login.html");
            });
        }
    );
};

LoginController.loginGoogle = function () {
    window.plugins.googleplus.login(
            {
                iOSApiKey: LoginController.IOS_API_KEY
            },
    function (obj) {
        var google_id = obj.userId;
        var tokentype = "";
        var token = "";
        
        if(obj.idToken === undefined){
            token = obj.oauthToken;
            tokentype = "access_token";
        }else{
            token = obj.idToken;
            tokentype = "id_token";
        }
        
        if($.ajaxSettings.headers && $.ajaxSettings.headers["facebookid"]) delete $.ajaxSettings.headers["facebookid"];
        
        $.ajaxSetup({
            headers: {googleid: google_id, token: token, tokentype: tokentype}
        });

        var userData = {name: obj.displayName, email: obj.email, language: App.locale, font_size: "S"};

        $.when(
                Service.login(userData)
                ).then(
                function (data) {
                    SciELO.saveCache(LoginController.USER_TYPE_KEY, LoginController.GOOGLE, false);
                    Navigator.loadPage("home.html");
                },
                function () {
                    SciELO.removeCache(LoginController.USER_TYPE_KEY);
                    App.showCommonDialog("SciELO", Localization.getAppValue("error-login"), function(){
                        Navigator.loadFullPage("login.html");
                    });
                }
        );
    },
            function (err) {
                App.trackException(errorDesc = "Error login google: "+JSON.stringify(err));
                
                App.showCommonDialog("SciELO",Localization.getAppValue("error-google"), function(){
                    Navigator.loadFullPage("login.html");
                });
            }
    );
};

LoginController.autoLogin = function () {
    if (SciELO.hasCache(LoginController.USER_TYPE_KEY, false)) {
        var loginType = SciELO.getCacheData(LoginController.USER_TYPE_KEY, false);
        if (loginType === LoginController.FACEBOOK) {
            LoginController.autoLoginFacebook();
        } else if (loginType === LoginController.GOOGLE) {
            LoginController.autoLoginGoogle();
        } else {
            SciELO.removeCache(LoginController.USER_TYPE_KEY);
            Navigator.loadFullPage("login.html");
        }
    } else {
        Navigator.loadFullPage("login.html");
    }
};

LoginController.autoLoginFacebook = function () {
    facebookConnectPlugin.getLoginStatus(
            function (response) {
                if (response.status === "connected") {
                    if($.ajaxSettings.headers && $.ajaxSettings.headers["googleid"]) delete $.ajaxSettings.headers["googleid"];
                    
                    console.log("#####TOKEN: "+response.authResponse.accessToken);
                    
                    $.ajaxSetup({
                        headers: {facebookid: response.authResponse.userID, token: response.authResponse.accessToken}
                    });
                    $.when(
                            Service.login({})
                            ).then(
                            function (data) {
                                // It worked
                                Navigator.loadPage("home.html");
                            },
                            function () {
                                SciELO.removeCache(LoginController.USER_TYPE_KEY);
                                Navigator.loadFullPage("login.html");
                            }
                    );
                } else {

                }
            },
            function (err) {
                App.trackException("Error loginStatus facebook: "+JSON.stringify(err));
                SciELO.removeCache(LoginController.USER_TYPE_KEY);
                Navigator.loadFullPage("login.html");
            });
};

LoginController.autoLoginGoogle = function () {
    window.plugins.googleplus.trySilentLogin(
            {
                iOSApiKey: LoginController.IOS_API_KEY
            },
    function (obj) {
        var google_id = obj.userId;
        var tokentype = "";
        var token = "";
        
        if(obj.idToken === undefined){
            token = obj.oauthToken;
            tokentype = "access_token";
        }else{
            token = obj.idToken;
            tokentype = "id_token";
        }
        
        if($.ajaxSettings.headers && $.ajaxSettings.headers["facebookid"]) delete $.ajaxSettings.headers["facebookid"];
        
        $.ajaxSetup({
            headers: {googleid: google_id, token: token, tokentype: tokentype}
        });

        $.when(
                Service.login({})
                ).then(
                function (data) {
                    SciELO.saveCache(LoginController.USER_TYPE_KEY, LoginController.GOOGLE, false);
                    Navigator.loadPage("home.html");
                },
                function (err) {
                    SciELO.removeCache(LoginController.USER_TYPE_KEY);
                    Navigator.loadFullPage("login.html");
                }
        );
    },
            function (msg) {    
                App.trackException("Error trySilentLogin google: "+JSON.stringify(msg));
                SciELO.removeCache(LoginController.USER_TYPE_KEY);
                Navigator.loadFullPage("login.html");
            }
    );
};