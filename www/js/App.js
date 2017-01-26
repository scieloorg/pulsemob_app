(function (window) {
    // Application object
    var App = window.App = {
        isInitialized: false,
        history: null,
        scrollApp: null,
        currentController: null,
        locale: "pt",
        fontSize: "S",
        $contentLoad: null,
        $content: null,
        $contentWrapper: null,
        $headerApp: null,
        $headerTitle: null,
        $iosSystemBar: null,
        $loadingDiv: null,
        $page: null,
        $appSearchInput: null,
        currentUser: null,
        DEBUG_BROWSER:false,
        constants: {
            APP_VERSION: "1.0.4",
            INTRODUCTION_SHOW: "introduction_show"
        }
    };

    //init project
    App.init = function () {
        if (!App.isInitialized) {
            App.history = new Array();
            
            try{
                analytics.startTrackerWithId('UA-59751520-1');
            }catch(err){
                if(!App.DEBUG_BROWSER) console.log(err);
            }

            App.setDomElements();
            App.addEventListeners();
            App.definitions();
            App.isInitialized = true;
            DataMapping.loadMap();
            ContextMenu.init();     
            
            App.collection = {};
            App.collectionsRemoved = [];
            App.collectionsSelected = [];

            $.ajaxSetup({
                statusCode: {
                    500: function (err) {
                        App.trackException("Error 500: "+JSON.stringify(err));
                        App.showCommonDialog("SciELO",Localization.getAppValue("error-500"));
                    }
                }
            });

            App.startLocale();
            
            if(!App.DEBUG_BROWSER){
                LoginController.autoLogin();
            }else{
                $.ajaxSetup({
                    headers: {facebookid: "446832978797059", token: "EAALA0Tnry2IBABI2Y2XZB2MFKrpVVZCgF4p5woGAMj8dlp5aWa0iq9CPkCrw1eiGxa5aZBtCFhpoiXXRLK4YEwbRQknQPqbvZCE4fqQirLyRdaMw0ysRRoJVVg3BczsvW2kCXeAwyKiH2yBfnV9uDY5uVxsIoZCt601puGhwOtgZDZD"}
                });

                $.when(
                    Service.login({name: "Infobase Apps", email: "infobaseapps@gmail.com", language: App.locale, font_size: "S"})
                ).then(
                    function (data) {
                        // It worked
                        Navigator.loadPage("home.html");
                    },
                    function () {
                        SciELO.removeCache(LoginController.USER_TYPE_KEY);
                        App.showCommonDialog("SciELO", Localization.getAppValue("error-login"), false);
                        Navigator.loadFullPage("login.html");
                    }
                );
            }
        }
    };

    //set Application elements
    App.setDomElements = function () {
        App.$contentLoad = $("#page-scroller");
        App.$content = $("#content");
        App.$headerApp = $('#app-bar');
        App.$headerTitle = $('#app-bar-title');
        App.$loadingDiv = $('#loading');
        App.$contentWrapper = $("#page-wrapper");
        App.$page = $("#page");
        App.$appSearchInput = $("#app-bar-search-input");
        App.$iosSystemBar = $("#ios-sys-bar");
    };

    //set definitions project
    App.definitions = function () {
        //fastclick, performance library of mouse events to touch events
        FastClick.attach(document.body);
        //block drag "navegator box"
        $(document).on('touchmove', function (event) {
            event.preventDefault();
        });
        
        if (typeof device !== 'undefined') {
            if (device.platform === "iOS") {
                cordova.plugins.Keyboard.disableScroll(true);
                App.$iosSystemBar.show();
                var totalHeight = App.$content.height() - App.$iosSystemBar.height();
                App.$content.height(totalHeight);
            }
        }
    };

    //set Application listeners
    App.addEventListeners = function () {
        //load internal pages
        App.$headerApp.on('tap', "#app-bar-back", Navigator.backEvent);
        App.$headerApp.on('tap', "#app-bar-search", App.search);
        App.$headerApp.on('tap', '.botoes-app', Navigator.loadPage);
        $("#app-bar-search-input input").focusout(App.searchFocusOut);
        App.$page.on('tap', '.botoes-app', Navigator.loadPage);


        $("#app-bar-search-input input").keypress(function (e) {
            if (e.which === 13) {
                $("#app-bar-search").trigger("tap");
            }
        });

        document.addEventListener("backbutton", Navigator.backEvent, true);
        document.addEventListener("searchbutton", App.search, true);
        document.addEventListener("menubutton", ContextMenu.toggleMenu, true);

        //listener end transition
        Transition.addEventListeners();
        //listener menu button


        //scroll
        App.$contentWrapper.height("100%");
        App.scrollApp = new IScroll('#page-wrapper', {scrollbars: false, click: false});

        // nao bugar o scroll quando tiver uma tela com input
        App.scrollApp.on('beforeScrollStart', function () {
            var focusObj = $(":focus");
            focusObj.blur();
        });
        
        App.scrollApp.on('scrollStart', function () {
            ContextMenu.hide();
        }); 

    };
    
    App.setLocale = function(locale){
        App.locale = locale;
        Localization.refreshAppLocale();
        if(App.currentController && Navigator.currentPage){
            PageLoad.loadLocalizationPage(App.currentController,Navigator.currentPage);
        }
    };

    App.startLocale = function () {
        try {
            navigator.globalization.getLocaleName(
                    function (loc) {
                        App.setLocale(loc.value.substr(0, 2));
                    },
                    function () {
                        App.setLocale("pt");
                    }
            );
        } catch (error) {
            App.setLocale("pt");
        }

    };
    
    App.setFontSize = function(size){
        if(size === "L"){
            $("body").removeClass("font-medium");
            $("body").addClass("font-large");
        }else if(size === "M"){
            $("body").removeClass("font-large");
            $("body").addClass("font-medium");
        }else{
            $("body").removeClass("font-large");
            $("body").removeClass("font-medium");
        }

        App.fontSize = size;
        App.refreshScroll(false);
    };

    App.searchFocusOut = function () {
        if ($(this).val() === "") {
            $("#app-bar-search-input").fadeOut(300, function () {
                $("#app-bar-title").fadeIn(300);
                if(!App.DEBUG_BROWSER)  cordova.plugins.Keyboard.close();
            });
        }
    };

    App.search = function () {
        if (App.$appSearchInput.is(":visible")) {
            if (App.$appSearchInput.children("input").val() !== "") {
                ArticlesByCategoryController.willStart = true;
                ArticlesByCategoryController.searchText = App.$appSearchInput.children("input").val();
                Navigator.loadPage("articlesByCategory.html");
                if(!App.DEBUG_BROWSER) cordova.plugins.Keyboard.close();
            }
        } else {
            $("#app-bar-title").fadeOut(300, function () {
                App.$appSearchInput.fadeIn(300, function () {
                    App.$appSearchInput.children("input").focus();
                    if(!App.DEBUG_BROWSER) cordova.plugins.Keyboard.show();
                });
            });
        }
    };

    App.refreshScroll = function (goTop) {
        setTimeout(function () {
            App.scrollApp.refresh();
            if (typeof goTop === 'undefined' || goTop)
                App.scrollApp.scrollTo(0, 0);
        }, 500);
    };

    App.showLoadingScreen = function () {
        //https://github.com/mobimentum/phonegap-plugin-loading-spinner
        if(!App.DEBUG_BROWSER) {
            spinnerplugin.show({
                overlay: true,    // defaults to true
                timeout: 30,       // defaults to 0 (no timeout)
                fullscreen: false  // defaults to false
            });
        }
    };

    App.hideLoadingScreen = function () {
        //https://github.com/mobimentum/phonegap-plugin-loading-spinner
        if(!App.DEBUG_BROWSER) spinnerplugin.hide();
    };

    App.showBackButton = function () {
        $("#app-bar-blank").hide();
        $("#app-bar-back").show();
    };

    App.hideBackButton = function () {
        $("#app-bar-back").hide();
        $("#app-bar-blank").show();
    };

    App.showFullPage = function () {
        var defaultHeight = 0;
        if (typeof device !== 'undefined') {
            if (device.platform === "iOS") {
                defaultHeight = App.$iosSystemBar.height();
            }
        }
        App.$contentWrapper.css('top', '0px');
        App.$contentWrapper.height(window.innerHeight - defaultHeight);
        App.$headerApp.fadeOut(400);
    };

    App.showNormalPage = function () {
        var defaultHeight = 0;
        if (typeof device !== 'undefined') {
            if (device.platform === "iOS") {
                defaultHeight = App.$iosSystemBar.height();
            }
        }
        App.$contentWrapper.css('top', App.$headerApp.height());
        App.$contentWrapper.height(window.innerHeight - (App.$headerApp.height() + defaultHeight));
        App.$headerApp.fadeIn(1000);
    };
    
    App.showCommonInternetErrorDialog = function () {
        App.hideLoadingScreen();
        Navigator.currentModal = new BootstrapDialog({
            message: Localization.getAppValue("error-internet"),
            title: "SciELO",
            buttons: [{
                    label: 'OK',
                    cssClass: 'btn-default btn-ok',
                    action: function (dialog) {
                        dialog.close();
                        Navigator.currentModal = null;
                    }
                }]
        });

        Navigator.currentModal.realize();
        Navigator.currentModal.open();
    };

    App.showCommonDialog = function (title, msg, cb) {
        App.hideLoadingScreen();
        Navigator.currentModal = new BootstrapDialog({
            message: msg,
            title: title,
            closable: false,
            buttons: [{
                    label: 'OK',
                    cssClass: 'btn-default btn-ok',
                    action: function (dialog) {
                        dialog.close();
                        Navigator.currentModal = null;
                        if (cb)
                            cb();
                    }
                }]
        });

        Navigator.currentModal.realize();
        Navigator.currentModal.open();
    };


    App.showCustomCommonDialog = function (title, btnLabel, msg, cb) {
        App.hideLoadingScreen();
        Navigator.currentModal = new BootstrapDialog({
            message: msg,
            title: title,
            closable: false,
            buttons: [{
                    label: btnLabel,
                    cssClass: 'btn-default btn-ok',
                    action: function (dialog) {
                        dialog.close();
                        Navigator.currentModal = null;
                        if (cb)
                            cb();
                    }
                }]
        });

        Navigator.currentModal.realize();
        Navigator.currentModal.open();
    };

    App.showCommonQuestionDialog = function (title, msg, btn1, cb1, btn2, cb2) {
        App.hideLoadingScreen();
        Navigator.currentModal = new BootstrapDialog({
            message: msg,
            title: title,
            closable: false,
            buttons: [{
                    label: btn1,
                    cssClass: 'btn-default btn-ok',
                    action: function (dialog) {
                        dialog.close();
                        Navigator.currentModal = null;
                        if (cb1)
                            cb1();
                    }
                }, {
                    label: btn2,
                    cssClass: 'btn-default btn-ok',
                    action: function (dialog) {
                        dialog.close();
                        Navigator.currentModal = null;
                        if (cb2)
                            cb2();
                    }
                }]
        });

        Navigator.currentModal.realize();
        Navigator.currentModal.open();
    };

    App.openLink = function (url) {
        if (typeof device !== 'undefined') {
            if (device.platform === "iOS") {
                window.open(url, '_system');
            } else if (device.platform === "Android") {
                navigator.app.loadUrl(url, {openExternal: true});
            }
        } else {
            window.open(url);
        }
    };
    
    App.trackView = function (viewName) {
        if(!App.DEBUG_BROWSER) {
            try{
                analytics.trackView(viewName);
            }catch(errAnalytics){
                console.log(errAnalytics);
            }
        }
    };
    
    App.trackEvent = function (eventCategory, eventAction, eventLabel ) {
        if(!App.DEBUG_BROWSER) {
            try{
                analytics.trackEvent(eventCategory, eventAction, eventLabel, 1);
            }catch(errAnalytics){
                console.log(errAnalytics);
            }
        }
    };
    
    App.trackException = function (errorDesc) {
        if(!App.DEBUG_BROWSER) {
            try{
                analytics.trackException(errorDesc, false);
            }catch(errAnalytics){
                console.log(errAnalytics);
            }
        }else{
            console.log(errorDesc);
        }
    };    

})(window);