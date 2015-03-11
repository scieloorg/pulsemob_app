var PreferencesController = function() {
};

PreferencesController.scroll = {};

PreferencesController.prototype = {
    initialize: function() {
        App.$page.addClass("pref-bg");
        
        PreferencesController.initListeners();
        PreferencesController.setFeedVersion();
        PreferencesController.initLanguageAndFont();
        try{
            analytics.trackView("Preferencias");
        }catch(err){
            console.log(err);
        }
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

    $("#font-container .radio-img img").attr("src","img/preferences/radio_unchecked.png");
    $("#font-radio-"+App.fontSize).attr("src","img/preferences/radio_checked.png");
};

PreferencesController.changeLanguage = function(){
    var language = $(this).data("language");
    $("#language-container .radio-img img").attr("src","img/preferences/radio_unchecked.png");
    $("#language-radio-"+language).attr("src","img/preferences/radio_checked.png");
    
    App.setLocale(language);
    App.initCategoryMenu();
    PageLoad.loadLocalizationPage(App.currentController, Navigator.currentPage);
    PreferencesController.setFeedVersion();
    
    Service.changeLanguage(language);
    
    try{
        analytics.trackEvent('Preferencias', 'Idioma', language, 1);
    }catch(err){
        console.log(err);
    }
};

PreferencesController.changeFont = function(){
    var fontSize = $(this).data("font");
    $("#font-container .radio-img img").attr("src","img/preferences/radio_unchecked.png");
    $("#font-radio-"+fontSize).attr("src","img/preferences/radio_checked.png");
    
    App.setFontSize(fontSize);
    Service.changeFontSize(fontSize);
    
    try{
        analytics.trackEvent('Preferencias', 'Fonte', fontSize, 1);
    }catch(err){
        console.log(err);
    }
};

PreferencesController.rate = function(){
    if(typeof device !== 'undefined'){
        if(device.platform === "iOS"){
            App.openLink('itms-apps://itunes.apple.com/us/app/apple-store/id');
            
            try{
                analytics.trackEvent('Preferencias', 'Rate', 'iOS', 1);
            }catch(err){
                console.log(err);
            }
        }else if (device.platform === "Android"){
            App.openLink('market://details?id=br.com.scielo');
            
            try{
                analytics.trackEvent('Preferencias', 'Rate', 'Android', 1);
            }catch(err){
                console.log(err);
            }
        }
    }
};

PreferencesController.setFeedVersion = function(){
    $("#feed-version").html("SciELO News Feeder - "+Localization.getValue("version")+" "+App.constants.APP_VERSION);
};