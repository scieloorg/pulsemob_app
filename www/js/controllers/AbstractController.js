var AbstractController = function() {
};

AbstractController.articleData = null;


AbstractController.prototype = {
    initialize: function() {
        App.$page.addClass("abstract-bg");
        AbstractController.initListeners();
        AbstractController.populate();
        AbstractController.checkIfIsFavorite();
        App.showBackButton();
        
        try{
            analytics.trackView("Artigo");
            analytics.trackEvent('Artigo', 'Abrir', AbstractController.articleData.id, 1);
        }catch(err){
            console.log(err);
        }
    },
    destroy: function() {
        App.$page.removeClass("abstract-bg");
        App.hideBackButton();
        PageLoad.ajxHandle = null;
    }
};

AbstractController.initListeners = function(){
    $("#abstract-details").on('tap', "#add-fav-btn", AbstractController.favorite);
    $("#abstract-details").on('tap', "#share-btn", AbstractController.share);
    $("#abs-content").on('tap', ".abstract-web-btn", AbstractController.openWebArticle);
};

AbstractController.populate = function(){
    $(".abstract-header").css("background","url("+AbstractController.articleData.imgUrl+") no-repeat center top #fff");
    
    $("#article-title").html(AbstractController.articleData.title);
    $("#article-author").html(Localization.getValue("by")+" "+AbstractController.articleData.author);
    
    $("#article-category-journal").html(AbstractController.articleData.category + " - " +AbstractController.articleData.journal);
    $("#article-date").html(AbstractController.articleData.date);
    
    if(AbstractController.articleData.abstract){
        $("#article-abstract").html(AbstractController.articleData.abstract);
    }else{
        $("#btn-article-web2").hide();
    }
    
    $("#article-abstract").html(AbstractController.articleData.abstract);
    
    if(AbstractController.articleData.keywords && AbstractController.articleData.keywords !== "undefined"){
        $("#article-tags").html(Localization.getValue("tags")+": "+AbstractController.articleData.keywords);
    }
    
    
};

AbstractController.checkIfIsFavorite = function(){
    var allFavorites = App.currentUser.getAllFavorites();
    if(allFavorites.indexOf(AbstractController.articleData.id) >= 0){
        $("#add-fav-btn").children("img").attr("src","img/abstract/fav_selected.png");
    }
};

AbstractController.favorite = function(){
    App.showLoadingScreen();
    var allFavorites = App.currentUser.getAllFavorites();
    var $obj = $(this).children("img");
    
    if(allFavorites.indexOf(AbstractController.articleData.id) < 0){
        $.when(
            Service.favoriteArticle(AbstractController.articleData.id)
        ).then(
            function(){
                $obj.attr("src", "img/abstract/fav_selected.png");
                App.hideLoadingScreen();
                
                try{
                    analytics.trackEvent('Artigo', 'Favoritar', AbstractController.articleData.id, 1);
                }catch(err){
                    console.log(err);
                }
            },
            function (err) {
                App.hideLoadingScreen();
                App.showCommonInternetErrorDialog();
            }
        );
    }else{
        $.when(
            Service.unfavoriteArticle(AbstractController.articleData.id)
        ).then(
            function(){
                $obj.attr("src","img/abstract/fav.png");
                App.hideLoadingScreen();
                
                try{
                    analytics.trackEvent('Artigo', 'Desfavoritar', AbstractController.articleData.id, 1);
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
};

AbstractController.share = function(){
    var domain = AbstractController.articleData.imgUrl.split("/")[2];
    var pid = AbstractController.articleData.id.substring(0, AbstractController.articleData.id.length-3 );
    
    window.plugins.socialsharing.share(AbstractController.articleData.title+" -", "SciELO Mobile", null, "http://"+domain+"/scielo.php?script=sci_arttext&pid="+pid+"&lng="+App.locale+"&nrm=iso");
    
    try{
        analytics.trackEvent('Artigo', 'Compartilhar', AbstractController.articleData.id, 1);
    }catch(err){
        console.log(err);
    }
};

AbstractController.openWebArticle = function(){
    var domain = AbstractController.articleData.imgUrl.split("/")[2];
    var pid = AbstractController.articleData.id.substring(0, AbstractController.articleData.id.length-3 );
    
    App.openLink("http://"+domain+"/scielo.php?script=sci_arttext&pid="+pid+"&lng="+App.locale+"&nrm=iso");
    
    try{
        analytics.trackEvent('Artigo', 'Abrir na Web', AbstractController.articleData.id, 1);
    }catch(err){
        console.log(err);
    }
};