var AbstractController = function() {
};

AbstractController.prototype = {
    initialize: function() {
        App.$page.addClass("abstract-bg");
        AbstractController.initListeners();
        App.showBackButton();
    },
    destroy: function() {
        App.$page.removeClass("abstract-bg");
        App.hideBackButton();
        PageLoad.ajxHandle = null;
    }
};

AbstractController.initListeners = function(){
    $("#abstract-details").on('tap', "#add-fav-btn", AbstractController.addFavorite);
    $("#abstract-details").on('tap', "#share-btn", AbstractController.share);
    $("#abs-content").on('tap', ".abstract-web-btn", AbstractController.openWebArticle);
};

AbstractController.addFavorite = function(){
    alert("add fav");
};

AbstractController.share = function(){
    alert("share");  
};

AbstractController.openWebArticle = function(){
    App.openLink("http://www.scielo.org.za/scielo.php?script=sci_arttext&pid=S0256-95742014000100032&lng="+App.locale+"&nrm=iso");
};