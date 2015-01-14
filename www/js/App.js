(function(window) {
    // Application object
    var App = window.App = {
        isInitialized: false,
        history: null,
        scrollApp: null,
        scrollMenu: null,
        currentController:null,
        locale: "pt",
        $contentLoad:null,
        $menu: null,
        $content: null,
        $contentWrapper: null,
        $headerApp: null,
        $headerTitle: null,
        $loadingDiv: null,
        $blockDiv: null,
        $page: null,
        currentUser: null,
        constants:{
            APP_VERSION: "1.0.0"
        }
    };
    
    //init project
    App.init = function() {
        if(!App.isInitialized){
            
            App.history = new Array();

            App.setDomElements();
            App.addEventListeners();
            App.definitions();
            App.isInitialized = true;
            Localization.refreshAppLocale();
                        
            $.ajaxSetup({
                statusCode: {
                    500: function(){
                        App.showCommonDialog("App", "Ocorreu algum erro na aplicação. Por favor tente novamente mais tarde.");
                    }
                }
            });
            
            Navigator.loadFullPage('login.html');
        }
    };
    
    App.showMsgErroInternet = function(callback){
        App.hideLoadingScreen();
        Navigator.currentModal = new BootstrapDialog({
            message: 'Confira sua conexão com a internet e clique em OK para tentar novamente.',
            buttons: [{
                    label: 'OK',
                    cssClass: 'btn-default btn-ok',
                    action: function(dialog) {
                        dialog.close();
                        Navigator.currentModal = null;
                        callback();
                    }
                }]
        });
        Navigator.currentModal.realize();
        Navigator.currentModal.open();
        
    };
    
    //set Application elements
    App.setDomElements = function() {
        App.$contentLoad = $("#page-scroller");
        App.$menu = $("#menu");
        App.$content = $("#content");
        App.$headerApp = $('#app-bar');
        App.$headerTitle = $('#app-bar-title');
        App.$loadingDiv = $('#loading');
        App.$blockDiv = $('#block-content');
        App.$contentWrapper = $("#page-wrapper");
        App.$page = $("#page");
    };
    
    //set definitions project
    App.definitions = function() {
        //fastclick, performance library of mouse events to touch events
        FastClick.attach(document.body);
        //block drag "navegator box"
        $(document).on('touchmove', function(event) {
            event.preventDefault();
        });
    };
    
    //set Application listeners
    App.addEventListeners = function() {
    	//load internal pages
        App.$headerApp.on('tap', "#app-bar-menu", Transition.toggleMenu);
        App.$headerApp.on('tap', "#app-bar-search", App.search);
        App.$headerApp.on('tap', '.botoes-app', Navigator.loadPage);
        $("#app-bar-search-input input").focusout(App.searchFocusOut);
        App.$menu.on('tap', ".menu-checkbox", App.menuCheckbox);
        App.$page.on('tap', '.botoes-app', Navigator.loadPage);
        
        document.addEventListener("backbutton", Navigator.backEvent, true);
        
        //listener end transition
        Transition.addEventListeners();
        //listener menu button
        
        //listener swipe events
        Hammer(document).on("swipeleft", Transition.swipeleftMenu);
        
        ContextMenu.init();
        
        //scroll
        App.$contentWrapper.height("100%");
        
        App.scrollMenu = new IScroll('#menu-content', {scrollbars: false, click: false});
        App.scrollApp = new IScroll('#page-wrapper', {scrollbars: false, click: false}); 
        
        // nao bugar o scroll quando tiver uma tela com input
        App.scrollApp.on('beforeScrollStart',function() {
            var focusObj = $(":focus");
            focusObj.blur();
        });
        
    };
    
    App.searchFocusOut = function() {
        if($(this).val() === ""){
            $("#app-bar-search-input").fadeOut(300,function(){
                $("#app-bar-title").fadeIn(300);
            });
        }
    };
    
    App.search = function(){
        var $appSearchInput = $("#app-bar-search-input");
        if($appSearchInput.is(":visible")){
            if($appSearchInput.children("input").val() !== ""){
                alert("pesquisa");
            }
        }else{
            $("#app-bar-title").fadeOut(300,function(){
                $appSearchInput.fadeIn(300,function(){
                    $appSearchInput.children("input").focus();
                });
            });
        }
    };
    
    App.menuCheckbox = function(){
        var value = true;
        
        if($(this).children("img").attr("src") === "img/sidebar/unchecked.png"){
            $(this).children("img").attr("src","img/sidebar/checked.png");
        }else{
            $(this).children("img").attr("src","img/sidebar/unchecked.png");
            value = false;
        }
        
        var data = {category: $(this).data("category"), value: value};
        
        /*$.when(
                SciELO.category(data) 
        ).then( 
             function(json){
                 
             }, 
             function(err){}
        ); */
    };
    
    App.refreshScroll = function(goTop){
        setTimeout(function () {
            App.scrollApp.refresh();
            if(typeof goTop === 'undefined' || goTop)
                App.scrollApp.scrollTo(0,0);
        }, 500);
    };
    
    App.showLoadingScreen = function(){
        //https://github.com/mobimentum/phonegap-plugin-loading-spinner
//        window.spinnerplugin.show();
    };
    
    App.hideLoadingScreen = function(){
        //https://github.com/mobimentum/phonegap-plugin-loading-spinner
//        window.spinnerplugin.hide();
    };
    
    App.showBackButton = function(){
        $("#app-bar-title-adjust").hide();
        $("#app-bar-back").show();
    };
    
    App.hideBackButton = function(){
        $("#app-bar-back").hide();
        $("#app-bar-title-adjust").show();
    };
    
    App.showFullPage = function(){
        App.$page.css('top', '0px');
        App.$contentWrapper.height("100%");
        App.$headerApp.fadeOut(400);
    };
    
    App.showNormalPage = function(){
        App.$page.css('top', App.$headerApp.height());
        App.$contentWrapper.height(window.innerHeight - App.$headerApp.height());
        App.$headerApp.fadeIn(1000);
    };
    
    App.showCommonDialog = function(title, msg, cb){
        App.hideLoadingScreen();
        Navigator.currentModal = new BootstrapDialog ({
            message: msg,
			title: title,
            buttons: [{
                label: 'OK',
                cssClass: 'btn-default btn-ok',
                action: function(dialog) {
                    dialog.close();
                    Navigator.currentModal = null;
                    if(cb) cb();
                }
            }]
        });
        
        Navigator.currentModal.realize();
        Navigator.currentModal.open();
    };
    
    
    App.showCustomCommonDialog = function(title, btnLabel, msg, cb){
        App.hideLoadingScreen();
        Navigator.currentModal = new BootstrapDialog ({
            message: msg,
			title: title,
            buttons: [{
                label: btnLabel,
                cssClass: 'btn-default btn-ok',
                action: function(dialog) {
                    dialog.close();
                    Navigator.currentModal = null;
                    if(cb) cb();
                }
            }]
        });
        
        Navigator.currentModal.realize();
        Navigator.currentModal.open();
    };
    
    App.showCommonQuestionDialog = function(title, msg, btn1, cb1, btn2, cb2){
        App.hideLoadingScreen();
        Navigator.currentModal = new BootstrapDialog ({
            message: msg,
            title: title,
            buttons: [{
                label: btn1,
                cssClass: 'btn-default btn-ok',
                action: function(dialog) {
                    dialog.close();
                    Navigator.currentModal = null;
                    if(cb1) cb1();
                }
            },{
                label: btn2,
                cssClass: 'btn-default btn-ok',
                action: function(dialog) {
                    dialog.close();
                    Navigator.currentModal = null;
                    if(cb2) cb2();
                }
            }]
        });
        
        Navigator.currentModal.realize();
        Navigator.currentModal.open();
    };
    
    App.openLink = function(url){
        if(typeof device !== 'undefined'){
            if(device.platform === "iOS"){
                window.open(url, '_system');
            }else if (device.platform === "Android"){
                navigator.app.loadUrl(url, { openExternal:true });
            }
        }else{
            window.open(url);
        }
    };
    
})(window);