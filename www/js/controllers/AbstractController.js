var AbstractController = function() {
};

AbstractController.articleData = null;


AbstractController.prototype = {
    initialize: function() {
        App.$page.addClass("abstract-bg");
        AbstractController.initListeners();
        AbstractController.populate();
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

AbstractController.addFavorite = function(){
    alert("add fav");
};

AbstractController.share = function(){
    alert("share");  
};

AbstractController.openWebArticle = function(){
    var domain = AbstractController.articleData.imgUrl.split("/")[2];
    App.openLink("http://"+domain+"/scielo.php?script=sci_arttext&pid="+AbstractController.articleData.id+"&lng="+App.locale+"&nrm=iso");
};