var PoliticsController = function() {
};

PoliticsController.prototype = {
    initialize: function() {
        App.$page.addClass("pref-bg");
        App.showBackButton();
    },
    destroy: function() {
        App.$page.removeClass("pref-bg");
        App.hideBackButton();
        PageLoad.ajxHandle = null;
    }
};
