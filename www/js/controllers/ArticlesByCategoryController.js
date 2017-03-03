var ArticlesByCategoryController = function() {
};

ArticlesByCategoryController.scroll = {};
ArticlesByCategoryController.docs = {};
ArticlesByCategoryController.$categories = null;
ArticlesByCategoryController.searchText = null;
ArticlesByCategoryController.willStart = false;

ArticlesByCategoryController.prototype = {
    initialize: function() {
        App.showLoadingScreen();
        
        if(Navigator.currentPageScreenData){
            ArticlesByCategoryController.searchText = Navigator.currentPageScreenData;
        }
        
        ArticlesByCategoryController.$categories = $("#categories");
        
        ArticlesByCategoryController.start();
        ArticlesByCategoryController.initListeners();
        ArticlesByCategoryController.willStart = false;
    },
    destroy: function() {
        PageLoad.ajxHandle = null;
        ArticlesByCategoryController.cleanData();
    },
    refresh: function(){
        App.showLoadingScreen();
        
        ArticlesByCategoryController.cleanData();
        
        ArticlesByCategoryController.searchText = $("#articles-search-text input").val();
        ArticlesByCategoryController.start();
    },
    getScreenData: function () {
        return ArticlesByCategoryController.searchText;
    }
};

ArticlesByCategoryController.start = function(){
    ArticlesByCategoryController.$categories.html("");
    
    if(ArticlesByCategoryController.searchText){
        $("#articles-search-text input").val(ArticlesByCategoryController.searchText);
        $("#articles-search-box").show();
        ArticlesByCategoryController.doSearch();
        App.trackView("Pesquisa");
    }else{
        ArticlesByCategoryController.showFavorites();
        App.trackView("Favoritos");
    }
};


ArticlesByCategoryController.initListeners = function () {
    $("#articles-search-box").on('tap', "#articles-search-btn", ArticlesByCategoryController.editAndSearch);
    ArticlesByCategoryController.$categories.on('tap', '.article-link', ArticleUtils.openArticle);
    
    $("#articles-search-text input").keypress(function(e) {
        if(e.which === 13) {
            $("#articles-search-btn").trigger("tap");
        }
    });
};

ArticlesByCategoryController.showFavorites = function(){
    $.when(
        Service.listFavoriteArticles()
    ).then(
        function (json) {
            if(!json || !json.docs || json.docs.length < 1){
                $("#string-no-favorites").show();
                App.refreshScroll(true);
                App.hideLoadingScreen();
            }else{
                ArticlesByCategoryController.showArticles(json);
            }
        },
        function (err) {
            App.trackException("Error Loading Favorites: "+JSON.stringify(err));
            App.hideLoadingScreen();
            App.showCommonInternetErrorDialog();
            return;
        }
    );
};

ArticlesByCategoryController.doSearch = function () {

    var params = {q: ArticlesByCategoryController.searchText};

    $.when(
        SciELO.search(params)
    ).then(
        function (json) {
            if(!json || !json.response || !json.response.docs || json.response.docs.length < 1){
                $("#string-no-search-results").show();
                App.refreshScroll(true);
                App.hideLoadingScreen();
            }else{
                ArticlesByCategoryController.showArticles(json.response);
            }
        },
        function (err) {
            App.trackException("Error on search: "+JSON.stringify(err));
            App.hideLoadingScreen();
            App.showCommonInternetErrorDialog();
            return;
        }
    );
}


ArticlesByCategoryController.showArticles = function (solrResults) {
    var categoriesUsed = [];

    for (var i = 0; i < solrResults.docs.length; i++) {
        var doc = solrResults.docs[i];
        

        for (var j = 0; j < doc.subject_areas_ids.length; j++) {
            var catId = doc.subject_areas_ids[j];
            
            if (!ArticlesByCategoryController.docs[catId]) {
                ArticlesByCategoryController.docs[catId] = [];
                categoriesUsed.push(catId);
            }

            ArticlesByCategoryController.docs[catId].push(doc);
        }
    }

    var categoriesOrder = DataMapping.getCategoriesOrder();

    for (var i = 0; i < categoriesOrder.length; i++) {
        var catId = categoriesOrder[i];
        if(categoriesUsed.indexOf(catId) >= 0){
            ArticlesByCategoryController.addCategory(catId, ArticlesByCategoryController.docs[catId].length);
        }
    }
    
    App.refreshScroll(true);
    App.hideLoadingScreen();
};

ArticlesByCategoryController.addCategory = function(catId, docsLenght){
    
    var html = '<div class="magazine">' +
                    '<div class="magazine-bar">' +
                        '<table>' +
                            '<tr>' +
                                '<td class="magazine-bar-title">'+DataMapping.getCategoryName(catId)+'</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                    '<div class="section-content">';
            
            
    html +=                  '<div id="category-wrapper-'+catId+'" class="wrapper">' +
                                '<div id="category-scroller-'+catId+'" class="scroller magazine-scroller" >' +
                                    '<ul>';

            for(var i=0; i<docsLenght && i<10 ;i++){
                html += '<li class="article"><img class="loading-img" src="img/loading.gif"/></li>';
            }

    html +=                         '</ul>' +
                                '</div>' +
                            '</div>' +
                            '</div>' +
                        '</div>';

    ArticlesByCategoryController.$categories.append(html);
    
    ArticlesByCategoryController.scroll[catId] = new IScroll('#category-wrapper-'+catId, {
        scrollX: true,
        scrollY: false,
        mouseWheel: false,
        infiniteElements: '#category-scroller-'+catId+' .article',
        infiniteLimit: docsLenght,
        dataset: ArticlesByCategoryController.requestData,
        dataFiller: ArticleUtils.updateContent,
        cacheSize: docsLenght,
        categoryId: catId
    });
};

ArticlesByCategoryController.requestData = function (start, count) {
    var categoryId = $(this)[0].options.categoryId;
    
    setTimeout(function(){
        if(ArticlesByCategoryController.scroll[categoryId]){
            ArticlesByCategoryController.scroll[categoryId].updateCache(start, ArticlesByCategoryController.docs[categoryId]);
        }
    },500);
};

ArticlesByCategoryController.editAndSearch = function(){
    if($(this).children("img").attr("src") === "img/home/edit_search.png"){
        $(this).children("img").attr("src","img/home/search.png");
        $("#articles-search-text input").removeAttr('disabled');
        $("#articles-search-text input").focus();
    }else{
        $("#articles-search-text input").attr('disabled','disabled');
        $(this).children("img").attr("src","img/home/edit_search.png");
        App.showLoadingScreen();
        
        ArticlesByCategoryController.cleanData();
        $("#string-no-search-results").hide();
        
        ArticlesByCategoryController.searchText = $("#articles-search-text input").val();
        ArticlesByCategoryController.start();
    }
    
};

ArticlesByCategoryController.cleanData = function(){
    for(var categoryId in ArticlesByCategoryController.scroll){
        ArticlesByCategoryController.scroll[categoryId].destroy();
    }
    
    ArticlesByCategoryController.docs = {};
    ArticlesByCategoryController.scroll = {};
    if(!ArticlesByCategoryController.willStart){
        ArticlesByCategoryController.searchText = null;
    }
};