(function (window) {
    // Application object
    var App = window.App = {
        isInitialized: false,
        history: null,
        scrollApp: null,
        scrollMenu: null,
        currentController: null,
        locale: "pt",
        fontSize: "S",
        $contentLoad: null,
        $menu: null,
        $content: null,
        $contentWrapper: null,
        $headerApp: null,
        $headerTitle: null,
        $loadingDiv: null,
        $blockDiv: null,
        $page: null,
        $appSearchInput: null,
        currentUser: null,
        DEBUG_BROWSER:false,
        constants: {
            APP_VERSION: "1.0.3"
        }
    };

    //init project
    App.init = function () {
        if (!App.isInitialized) {
            App.history = new Array();
            
            try{
                analytics.startTrackerWithId('UA-59751520-1');
            }catch(err){
                console.log(err);
            }

            App.setDomElements();
            App.addEventListeners();
            App.definitions();
            App.isInitialized = true;
            Localization.refreshAppLocale();
            FeedsAndPublications.loadMap();
            ContextMenu.init();

            $.ajaxSetup({
                statusCode: {
                    500: function () {
                        App.showCommonDialog("App", "Ocorreu algum erro na aplicação. Por favor tente novamente mais tarde.");
                    }
                }
            });

            App.startLocale();
            
            if(!App.DEBUG_BROWSER){
                LoginController.autoLogin();
            }else{
                $.ajaxSetup({
                    headers: {facebookid: "944948448856222", token: "CAALA0Tnry2IBAPJdZCAuyuoUikqzaCesUKiZAWFYQ6ODu2ddnyGRy9fPtupsqgnZAaqnZAYddQGUdAOoPNZB09j3E1qru3B1KgZAjC8ZCdOMFSkvoXihdJgSweyBuILIqK5x44VknMpEXrRDPcamKpPXJeS57fpvvMlcCiwOfkAWkJgY3kuvtKBM8tOQJJa7QZBIDekPrAAHTLACP5yKq4S5ZCU7NtyZAxWDFDmaatMrHlrAZDZD"}
                });

                $.when(
                        Service.login({name: "Marcellus S.B.", email: "marcellus.sb@gmail.com", language: App.locale, font_size: "S"})
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
            }
        }
    };

    //set Application elements
    App.setDomElements = function () {
        App.$contentLoad = $("#page-scroller");
        App.$menu = $("#menu");
        App.$content = $("#content");
        App.$headerApp = $('#app-bar');
        App.$headerTitle = $('#app-bar-title');
        App.$loadingDiv = $('#loading');
        App.$blockDiv = $('#block-content');
        App.$contentWrapper = $("#page-wrapper");
        App.$page = $("#page");
        App.$appSearchInput = $("#app-bar-search-input");
    };

    //set definitions project
    App.definitions = function () {
        //fastclick, performance library of mouse events to touch events
        FastClick.attach(document.body);
        //block drag "navegator box"
        $(document).on('touchmove', function (event) {
            event.preventDefault();
        });
    };

    //set Application listeners
    App.addEventListeners = function () {
        //load internal pages
        App.$headerApp.on('click', "#app-bar-menu", Transition.toggleMenu);
        App.$headerApp.on('click', "#app-bar-back", Navigator.backEvent);
        App.$headerApp.on('click', "#app-bar-search", App.search);
        App.$headerApp.on('click', '.botoes-app', Navigator.loadPage);
        $("#app-bar-search-input input").focusout(App.searchFocusOut);
        App.$menu.on('tap', ".menu-checkbox", App.menuCheckbox);
        App.$page.on('tap', '.botoes-app', Navigator.loadPage);


        $("#app-bar-search-input input").keypress(function (e) {
            if (e.which === 13) {
                $("#app-bar-search").trigger("click");
            }
        });

        document.addEventListener("backbutton", Navigator.backEvent, true);

        //listener end transition
        Transition.addEventListeners();
        //listener menu button

        //listener swipe events
        Hammer(document).on("swipeleft", Transition.swipeleftMenu);


        //scroll
        App.$contentWrapper.height("100%");

        App.scrollMenu = new IScroll('#menu-content', {scrollbars: false, click: false});
        App.scrollApp = new IScroll('#page-wrapper', {scrollbars: false, click: false});

        // nao bugar o scroll quando tiver uma tela com input
        App.scrollApp.on('beforeScrollStart', function () {
            var focusObj = $(":focus");
            focusObj.blur();
        });

    };
    
    App.setLocale = function(locale){
        App.locale = locale;
        Localization.refreshAppLocale();
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

        App.scrollMenu.refresh();
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
                Navigator.loadPage("home.html");
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

    App.initCategoryMenu = function () {
        var $categoryMenu = $("#categories-menu");
        $categoryMenu.html("");

        var allCategories = FeedsAndPublications.getCategoriesOrder();
        var categoriesRemoved = App.currentUser.getAllFeedsExclusions();

        for (var i in allCategories) {
            var cat = parseInt(allCategories[i]);

            var img = (categoriesRemoved.indexOf(cat) < 0) ? 'checked' : 'unchecked';

            var html = '<tr class="menu-row">' +
                            '<td id="menu-checkbox-'+cat+'" class="menu-checkbox" data-category="'+cat+'"><img src="img/sidebar/'+img+'.png"/></td>' +
                            '<td class="menu-text">'+FeedsAndPublications.getCategoryName(cat)+'</td>' +
                        '</tr>';
                
            $categoryMenu.append(html);
        }

        App.scrollMenu.refresh();
        
    };

    App.menuCheckbox = function () {
        App.showLoadingScreen();
        
        var catId = $(this).data("category");
        var $obj = $(this).children("img");

        if ($obj.attr("src") === "img/sidebar/unchecked.png") {
            
            $.when(
                Service.checkFeed(catId)
            ).then(
                function(){
                    $obj.attr("src", "img/sidebar/checked.png");
                    App.hideLoadingScreen();
                    
                    try{
                        analytics.trackEvent('Categoria', 'Adicionar', FeedsAndPublications.getCategoryName(catId), 1);
                    }catch(err){
                        console.log(err);
                    }
                },
                function (err) {
                    App.hideLoadingScreen();
                    App.showCommonInternetErrorDialog();
                }
            );
        } else {
            
            
            $.when(
                Service.uncheckFeed(catId)
            ).then(
                function(){
                    $obj.attr("src", "img/sidebar/unchecked.png");
                    App.hideLoadingScreen();
                    
                    try{
                        analytics.trackEvent('Categoria', 'Remover', FeedsAndPublications.getCategoryName(catId), 1);
                    }catch(err){
                        console.log(err);
                    }
                },
                function (err) {
                    App.hideLoadingScreen();
                    App.showCommonInternetErrorDialog();
                }
            );
        }

        // alterando a config de categorias a home eh diferente
        SciELO.homeCleanCache();
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
                overlay: false,    // defaults to true
                timeout: 30,       // defaults to 0 (no timeout)
                fullscreen: false,  // defaults to false
            });
        }
    };

    App.hideLoadingScreen = function () {
        //https://github.com/mobimentum/phonegap-plugin-loading-spinner
        if(!App.DEBUG_BROWSER) spinnerplugin.hide();
    };

    App.showBackButton = function () {
        $("#app-bar-menu").hide();
        $("#app-bar-back").show();
    };

    App.hideBackButton = function () {
        $("#app-bar-back").hide();
        $("#app-bar-menu").show();
    };

    App.showFullPage = function () {
        App.$page.css('top', '0px');
        App.$contentWrapper.height("100%");
        App.$headerApp.fadeOut(400);
    };

    App.showNormalPage = function () {
        App.$page.css('top', App.$headerApp.height());
        App.$contentWrapper.height(window.innerHeight - App.$headerApp.height());
        App.$headerApp.fadeIn(1000);
    };
    
    App.showCommonInternetErrorDialog = function () {
        App.hideLoadingScreen();
        Navigator.currentModal = new BootstrapDialog({
            message: "Por favor verifique a conexão com internet e tente realizar a operação novamente.",
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

})(window);