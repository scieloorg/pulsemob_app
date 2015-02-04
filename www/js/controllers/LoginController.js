var LoginController = function () {
};

LoginController.USER_TYPE_KEY = "SCIELO_USER_TYPE";
LoginController.FACEBOOK = "FACEBOOK";
LoginController.GOOGLE = "GOOGLE";
LoginController.IOS_API_KEY = "903038984767-9ngq0ut4esd5247kd3oog8jimnab1n9e.apps.googleusercontent.com";

LoginController.prototype = {
    initialize: function () {
        LoginController.initListeners();
    },
    destroy: function () {
        PageLoad.ajxHandle = null;
    }
};

LoginController.initListeners = function () {
    document.getElementById('btn-login-facebook').addEventListener('tap', LoginController.loginFacebook, false);
    document.getElementById('btn-login-google').addEventListener('tap', LoginController.loginGoogle, false);
};

LoginController.loginFacebook = function () {

    facebookConnectPlugin.login(["public_profile", "email"],
            function (response) {
                var facebookid = response.authResponse.userID;
                var token = response.authResponse.accessToken;

                facebookConnectPlugin.api(facebookid + "/?fields=email, name", ["public_profile"],
                        function (responseAPI) {
                            $.ajaxSetup({
                                headers: {facebookid: facebookid, googleid: undefined, token: token}
                            });

                            var userData = {name: responseAPI.name, email: responseAPI.email, language: App.locale, font_size: "S"};

                            $.when(
                                    Service.login(userData)
                                    ).then(
                                    function (data) {
                                        SciELO.saveCache(LoginController.USER_TYPE_KEY, LoginController.FACEBOOK, false);
                                        Navigator.loadPage("home.html");
                                    },
                                    function () {
                                        App.showCommonDialog("ERROR", "Error on server login.", false);
                                        Navigator.loadFullPage("login.html");
                                    }
                            );
                        },
                        function (err) {
                            App.showCommonDialog("ERROR", "Error getting information.", false);
                            Navigator.loadFullPage("login.html");
                        });
            }, function (err) {
        App.showCommonDialog("ERROR", "Login error.", false);
        Navigator.loadFullPage("login.html");
    });
};

LoginController.loginGoogle = function () {
    window.plugins.googleplus.login(
            {
                iOSApiKey: LoginController.IOS_API_KEY
            },
    function (obj) {
        var google_id = obj.userId;
        var token = obj.idToken === undefined ? obj.oauthToken : obj.idToken;
        
        $.ajaxSetup({
            headers: {googleid: google_id, facebookid: undefined, token: token}
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
                    App.showCommonDialog("ERROR", "Error on server login.", false);
                    Navigator.loadFullPage("login.html");
                }
        );
    },
            function (msg) {
                App.hideLoadingScreen();
                App.showCommonDialog("ERROR", "Login failed. (" + msg + ")", false);
                Navigator.loadFullPage("login.html");
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
                    $.ajaxSetup({
                        headers: {facebookid: response.authResponse.userID, googleid: undefined, token: response.authResponse.accessToken}
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
                                App.showCommonDialog("ERROR", "Error on server login.", false);
                                Navigator.loadFullPage("login.html");
                            }
                    );
                } else {

                }
            },
            function (err) {
                SciELO.removeCache(LoginController.USER_TYPE_KEY);
                Navigator.loadFullPage("login.html");
            });
};

LoginController.autoLoginGoogle = function (cachedUser) {
    window.plugins.googleplus.trySilentLogin(
            {
                iOSApiKey: LoginController.IOS_API_KEY
            },
    function (obj) {
        var google_id = obj.userId;
        var token = obj.idToken === undefined ? obj.oauthToken : obj.idToken;
        
        $.ajaxSetup({
            headers: {googleid: google_id, facebookid: undefined, token: token}
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
                    App.showCommonDialog("ERROR", "Error on server login.", false);
                    Navigator.loadFullPage("login.html");
                }
        );
    },
            function (msg) {
                SciELO.removeCache(LoginController.USER_TYPE_KEY);
                Navigator.loadFullPage("login.html");
            }
    );
};