var PreferencesController = function() {
};

PreferencesController.scroll = {};
PreferencesController.fontSize = "small";

PreferencesController.prototype = {
    initialize: function() {
        App.$page.addClass("pref-bg");
        
        PreferencesController.initListeners();
        PreferencesController.setFeedVersion();
        PreferencesController.initLanguageAndFont();
    },
    destroy: function() {
        App.$page.removeClass("pref-bg");
        PageLoad.ajxHandle = null;
    }
};

PreferencesController.initListeners = function(){
    $("#language-container").on('tap', '.radio-img', PreferencesController.changeLanguage);
    $("#font-container").on('tap', '.radio-img', PreferencesController.changeFont);
    $("#rate-container").on('tap', '#rate-btn', PreferencesController.rate);
};

PreferencesController.initLanguageAndFont = function(){
    $("#language-container .radio-img img").attr("src","img/preferences/radio_unchecked.png");
    $("#language-radio-"+App.locale).attr("src","img/preferences/radio_checked.png");
    
    var fontSize = "small"; // TODO: pegar do usuario
    $("#font-container .radio-img img").attr("src","img/preferences/radio_unchecked.png");
    $("#font-radio-"+PreferencesController.fontSize).attr("src","img/preferences/radio_checked.png");
};

PreferencesController.changeLanguage = function(){
    var language = $(this).data("language");
    $("#language-container .radio-img img").attr("src","img/preferences/radio_unchecked.png");
    $("#language-radio-"+language).attr("src","img/preferences/radio_checked.png");
    
    App.locale = language;
    Localization.refreshAppLocale();
    PageLoad.loadLocalizationPage(App.currentController, Navigator.currentPage);
    PreferencesController.setFeedVersion();
};

PreferencesController.changeFont = function(){
    var fontSize = $(this).data("font");
    $("#font-container .radio-img img").attr("src","img/preferences/radio_unchecked.png");
    $("#font-radio-"+fontSize).attr("src","img/preferences/radio_checked.png");
    
    if(fontSize === "large"){
        $("body").removeClass("font-medium");
        $("body").addClass("font-large");
    }else if(fontSize === "medium"){
        $("body").removeClass("font-large");
        $("body").addClass("font-medium");
    }else{
        $("body").removeClass("font-large");
        $("body").removeClass("font-medium");
    }
    
    PreferencesController.fontSize = fontSize;
    
    App.scrollMenu.refresh();
    App.refreshScroll(false);
};

PreferencesController.rate = function(){
    if(typeof device !== 'undefined'){
        if(device.platform === "iOS"){
            App.openLink('itms-apps://itunes.apple.com/us/app/apple-store/id');
        }else if (device.platform === "Android"){
            App.openLink('market://details?id=br.com.scielo');
        }
    }
};

PreferencesController.setFeedVersion = function(){
    $("#feed-version").html("SciELO News Feeder - "+Localization.getValue("version")+" "+App.constants.APP_VERSION);
};