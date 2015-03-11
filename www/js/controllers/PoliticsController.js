var PoliticsController = function() {
};

PoliticsController.prototype = {
    initialize: function() {
        App.$page.addClass("pref-bg");
        App.showBackButton();
        try{
            analytics.trackView("Politicas");
        }catch(err){
            console.log(err);
        }
    },
    destroy: function() {
        App.$page.removeClass("pref-bg");
        App.hideBackButton();
        PageLoad.ajxHandle = null;
    }
};
