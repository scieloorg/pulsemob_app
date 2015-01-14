var PreferencesController = function() {
};

PreferencesController.scroll = {};

PreferencesController.prototype = {
    initialize: function() {
        App.$page.addClass("pref-bg");
        
        PreferencesController.initListeners();
        PreferencesController.setFeedVersion();
    },
    destroy: function() {
        App.$page.removeClass("pref-bg");
        PageLoad.ajxHandle = null;
    }
};

PreferencesController.initListeners = function(){
    $("#language-container").on('tap', '.radio-img', PreferencesController.changeLanguage);
    $("#font-container").on('tap', '.radio-img', PreferencesController.changeFont);
    $("#rate-container").on('tap', '.rate-star', PreferencesController.rate);
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
};

PreferencesController.rate = function(){
    var rate = $(this).data("rate");
    $("#rate-container .rate-star img").attr("src","img/preferences/star.png");
    for(var i =1; i<= rate ;i++){
        $("#rate"+i).attr("src","img/preferences/star_selected.png");
    }
};

PreferencesController.setFeedVersion = function(){
    $("#feed-version").html("SciELO News Feeder - "+Localization.getValue("version")+" "+App.constants.APP_VERSION);
};