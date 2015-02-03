var HomeController = function() {
};

HomeController.firstData = {};
HomeController.scroll = {};
HomeController.$categories = null;
HomeController.searchText = null;
HomeController.isFavoritePage = false;

HomeController.prototype = {
    initialize: function() {
        HomeController.$categories = $("#categories");
        
        HomeController.searchText = App.$appSearchInput.children("input").val();
        
        if(Navigator.currentPageScreenData){
            HomeController.searchText = Navigator.currentPageScreenData.searchText;
            HomeController.isFavoritePage = Navigator.currentPageScreenData.isFavoritePage;
        }else{
            HomeController.searchText = App.$appSearchInput.children("input").val();
            App.$appSearchInput.children("input").val("");
            App.$appSearchInput.children("input").blur();
            
            HomeController.isFavoritePage = ContextMenu.showFavorites;
            ContextMenu.showFavorites = false;
        }
        
        $.ajaxSetup({
            headers: { facebookId: "1374407149535012", token: "CAALA0Tnry2IBADU6x3aKZAXjvSrFCVaMaEgHZCFZCwyDA6mAZBVBAMu4C7QgVZCx4tJqijE0JZBQ4q115ODksMEv4koLjPDv6EMVIHPXGoL4NDcXgr3ZCOZAu9JZCXzOqZCBBNMKRd4PtPrBfZBYFucXwIyfHr2cIaQK5h52MllpJYcyzmZCoxV8fy8oNX027G6dNjez6jUgd1cZBjnzyYlmKZAxdjIZCBEjNmFirYZD" }
        });
        
        if(HomeController.searchText){
            $("#home-search-text input").val(HomeController.searchText);
            $("#home-search-box").show();
            HomeController.doSearch();
        }else if(HomeController.isFavoritePage){
            HomeController.showFavorites();
        }else{
            HomeController.showDefaultHome();
        }
        
        HomeController.initListeners();
//        Introduction.show();
    },
    destroy: function() {
        PageLoad.ajxHandle = null;
        HomeController.cleanData();
        
    },
    getScreenData: function () {
        var data = {};
        data.searchText = HomeController.searchText;
        data.isFavoritePage = HomeController.isFavoritePage;

        return data;
    },
    refresh: function(){
        if(HomeController.searchText){
            // todo
        }else if(HomeController.isFavoritePage){
            // todo
        }else{
            SciELO.homeCleanCache();
            HomeController.cleanData();
            HomeController.$categories.html("");
            HomeController.showDefaultHome();
        }
    }
};


HomeController.cleanData = function(){
    HomeController.firstData = {};
    HomeController.scroll = {};
    HomeController.searchText = null;
    HomeController.isFavoritePage = false;
};


HomeController.showDefaultHome = function () {
    $.when(
        SciELO.home()
    ).then(
        function (json) {
            for (var i = 0; i < json.length; i++) {
                var cat = json[i];

                HomeController.firstData[cat.feed_id] = cat.response.docs;

                var limitScroll = (cat.response.numFound > 500) ? 500 : cat.response.numFound;
                var cacheSize = (cat.response.numFound > 50) ? 50 : cat.response.numFound;
                var minElements = (cat.response.numFound > 10) ? 10 : cat.response.numFound;

                HomeController.addCategory({id: cat.feed_id, name: FeedsAndPublications.getCategoryName(cat.feed_id), minElements: minElements, limit: limitScroll, cacheSize: cacheSize});
            }

            App.refreshScroll(true);
        },
        function (err) {
        }
    );
    
};

HomeController.showFavorites = function () {
    $.when(
        SciELO.home()
    ).then(
        function (json) {
            for (var i = 0; i < json.length; i++) {
                var cat = json[i];

                HomeController.firstData[cat.feed_id] = cat.response.docs;

                var limitScroll = (cat.response.numFound > 500) ? 500 : cat.response.numFound;
                var cacheSize = (cat.response.numFound > 50) ? 50 : cat.response.numFound;
                var minElements = (cat.response.numFound > 10) ? 10 : cat.response.numFound;

                HomeController.addCategory({id: cat.feed_id, name: FeedsAndPublications.getCategoryName(cat.feed_id) + " Fav", minElements: minElements, limit: limitScroll, cacheSize: cacheSize});
            }

            App.refreshScroll(true);
        },
        function (err) {
        }
    );
    
};

HomeController.doSearch = function () {

    var params = {q: HomeController.searchText};

    $.when(
        SciELO.search(params)
    ).then(
        function (json) {
            var categoriesUsed = [];

            var docs = json.response.docs;
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];
                for (var j = 0; j < doc.subject_areas_ids.length; j++) {
                    var catId = doc.subject_areas_ids[j];
                    if (!HomeController.firstData[catId]) {
                        HomeController.firstData[catId] = [];
                        categoriesUsed.push(catId);
                    }

                    HomeController.firstData[catId].push(doc);
                }
            }


            for (var i = 0; i < categoriesUsed.length; i++) {
                var catId = categoriesUsed[i];
                
                var numDocs = HomeController.firstData[catId].length;
                
                HomeController.addCategory({id: catId, name: FeedsAndPublications.getCategoryName(catId), minElements: numDocs, limit: numDocs, cacheSize: numDocs});
            }

            App.refreshScroll(true);

            //console.log(JSON.stringify(HomeController.firstData));
        },
        function (err) {
        }
    );

};

HomeController.initListeners = function () {
    HomeController.$categories.on('tap', '.article-link', HomeController.openArticle);
        
    HomeController.$categories.on('tap', ".category-menu-btn", HomeController.toggleCategoryMenu);
    HomeController.$categories.on('tap', ".refresh-category", HomeController.categoryRefresh);
    HomeController.$categories.on('tap', ".share-category", HomeController.categoryShare);
    HomeController.$categories.on('tap', ".config-category", HomeController.categoryConfig);
    HomeController.$categories.on('tap', ".remove-category", HomeController.categoryRemove);
    
    $("#home-search-box").on('tap', "#home-search-btn", HomeController.editAndSearch);
    
    $("#home-search-text input").keypress(function(e) {
        if(e.which === 13) {
            $("#home-search-btn").trigger("tap");
        }
    });
    
};


HomeController.editAndSearch = function(){
    if($(this).children("img").attr("src") === "img/home/edit_search.png"){
        $(this).children("img").attr("src","img/home/search.png");
        $("#home-search-text input").removeAttr('disabled');
        $("#home-search-text input").focus();
    }else{
        $("#home-search-text input").attr('disabled','disabled');
        $(this).children("img").attr("src","img/home/edit_search.png");
        
        if(HomeController.searchText !== $("#home-search-text input").val()){
            HomeController.cleanData();
            HomeController.$categories.html("");
            HomeController.searchText = $("#home-search-text input").val();

            HomeController.doSearch();
        }
    }
    
};

HomeController.toggleCategoryMenu = function () {
    var catId = $(this).data("category");
    var $menu = $("#category-menu-"+catId);
    
    if ($menu.hasClass("context-menu-show")) {
        $menu.removeClass("context-menu-show");
    } else {
        $(".context-menu-show").removeClass("context-menu-show");
        $menu.addClass("context-menu-show");
    }
};

HomeController.categoryRefresh = function () {
    var catId = $(this).data("category");
    $("#category-menu-"+catId).removeClass("context-menu-show");
    
    HomeController.scroll[catId].scrollTo(0,0);
};

HomeController.categoryShare = function () {
    var catId = $(this).data("category");
    $("#category-menu-"+catId).removeClass("context-menu-show");
    
    alert("share "+catId);
};

HomeController.categoryConfig = function () {
    var catId = $(this).data("category");
    $("#category-menu-"+catId).removeClass("context-menu-show");
    
    CategoryConfigController.categoryId = catId;
    
    Navigator.loadPage("categoryConfig.html");
};

HomeController.categoryRemove = function () {
    var catId = $(this).data("category");
    $("#category-menu-"+catId).removeClass("context-menu-show");
    
    $("#category-"+catId).fadeOut(800, function(){
        $("#category-"+catId).remove();
        App.refreshScroll(false);
    });
    
    //User.removeCategory
    
    App.refreshScroll(false);
};

HomeController.addCategory = function (categoryData) {
    var html = '<div id="category-'+categoryData.id+'" class="category">' +
                    '<div class="category-bar">' +
                        '<table>' +
                            '<tr>' +
                                '<td id="category-title-'+categoryData.id+'" class="category-bar-title">'+categoryData.name+'</td>' +
                                '<td class="category-menu-btn" data-category="'+categoryData.id+'" ><img src="img/category/menu_icon.png"/></td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                    '<div class="category-content">' +
                    '<div id="category-menu-'+categoryData.id+'" class="pop-menu">' +
                        '<div class="pop-menu-content">' +
                            '<table>' +
                                '<tr class="context-menu-row refresh-category" data-category="'+categoryData.id+'" >' +
                                    '<td class="context-menu-icon"><img src="img/category/refresh.png"/></td>' +
                                    '<td class="item-text context-menu-text"><div>'+Localization.getValue('refresh')+'</div></td>' +
                                '</tr>' +
                                '<tr class="context-menu-row share-category" data-category="'+categoryData.id+'" >' +
                                    '<td class="context-menu-icon"><img src="img/category/share.png"/></td>' +
                                    '<td class="item-text context-menu-text"><div>'+Localization.getValue('share')+'</div></td>' +
                                '</tr>' +
                                '<tr class="context-menu-row config-category" data-category="'+categoryData.id+'" >' +
                                    '<td class="context-menu-icon"><img src="img/category/config.png"/></td>' +
                                    '<td class="item-text context-menu-text"><div>'+Localization.getValue('config')+'</div></td>' +
                                '</tr>' +
                                '<tr class="context-menu-row remove-category" data-category="'+categoryData.id+'" >' +
                                    '<td class="context-menu-icon"><img src="img/category/remove.png"/></td>' +
                                    '<td class="item-text context-menu-text"><div>'+Localization.getValue('remove')+'</div></td>' +
                                '</tr>' +
                            '</table>' +
                        '</div>' +
                    '</div>' +
                        
                    '<div id="cat-wrapper-'+categoryData.id+'" class="wrapper">' +
                        '<div id="cat-scroller-'+categoryData.id+'" class="scroller cat-scroller" >' +
                            '<ul data-category="'+categoryData.id+'">';
    
    for(var i=0; i<categoryData.minElements ;i++){
        html += '<li class="article"><img class="loading-img" src="img/loading.gif"/></li>';
    }
    
    html +=                 '</ul>' +
                        '</div>' +
                    '</div>' +
                    '</div>' +
                '</div>';
    
    HomeController.$categories.append(html);
    
    HomeController.scroll[categoryData.id] = new IScroll('#cat-wrapper-'+categoryData.id, { 
        scrollX: true,
        scrollY: false,
        mouseWheel: false,
        infiniteElements: '#cat-scroller-'+categoryData.id+' .article',
        infiniteLimit: categoryData.limit,
        dataset: HomeController.requestData,
        dataFiller: HomeController.updateContent,
        cacheSize: categoryData.cacheSize,
        category: categoryData.id
    });
    
};

HomeController.requestData = function (start, count) {
    var category = $(this)[0].options.category;
    
    if(start === 0){
        setTimeout(function(){
            if(HomeController.scroll[category]){
                HomeController.scroll[category].updateCache(start, HomeController.firstData[category]);
            }
        },500);
        
    } else if(HomeController.searchText === null){
        
        var query = "subject_areas_ids:"+category;
        
//        var journalsExcluded = User.getJournalsExecluded(category);
//        for(var i=0; i<journalsExcluded ;i++){
//            query += " -journal_title_id:"+journalsExcluded[i];
//        }
        
        var params = {q: query, start: start, rows: count};
    
        $.when(
                SciELO.feed(params) 
        ).then( 
            function(json){
                HomeController.scroll[category].updateCache(start, json.response.docs);
            }, 
            function(err){}
        );
    }
};

HomeController.updateContent = function (el, data) {
    if (typeof data !== 'undefined'){
        
        var abstract = (data["translated_abstracts_"+App.locale]) ? data["translated_abstracts_"+App.locale] : data.original_abstract;
        
        var title = (data["translated_titles_"+App.locale]) ? data["translated_titles_"+App.locale] : data.original_title;
        
        var keywords = (data["keywords_"+App.locale]) ? data["keywords_"+App.locale].join(", ") : "";
        
        var html = '<div class="article-link" data-articleid="'+data.publisher_id+'" data-abstract="'+btoa(unescape(encodeURIComponent(abstract)))+'" data-author="'+btoa(unescape(encodeURIComponent(data.first_author)))+'" data-keywords="'+btoa(unescape(encodeURIComponent(keywords)))+'" data-journal="'+btoa(unescape(encodeURIComponent(data.journal_title)))+'">'+
                        '<div class="article-principal">' +
                            '<img src="http://'+data.scielo_domain+'/img/revistas/'+data.journal_acronym+'/glogo.gif" />' +
                            '<div class="article-name">' +
                                title +
                            '</div>' +
                        '</div>' +
                        '<div class="article-legend">' +
                            '<div class="article-journal"> '+data.journal_abbreviated_title+' </div>' +
                            '<div class="article-date"> '+data.publication_date.formatToDateSciELO()+' </div>' +
                        '</div>' +
                    '</div>';
        
        
        el.innerHTML = html;
    }else{
        console.log('DEU RUIM: '+JSON.stringify(data));
        console.log(HomeController.scroll);
    }
};

HomeController.openArticle = function () {
    var articleData = {};
    articleData.id = $(this).data("articleid");
    articleData.abstract = decodeURIComponent(escape(atob($(this).data("abstract"))));
    articleData.author = decodeURIComponent(escape(atob($(this).data("author"))));
    articleData.title = $(this).children("div.article-principal").children("div.article-name").html();
    articleData.imgUrl = $(this).children("div.article-principal").children("img").attr("src");
    articleData.date = $(this).children("div.article-legend").children("div.article-date").html();
    articleData.journal = decodeURIComponent(escape(atob($(this).data("journal"))));;
    articleData.keywords = decodeURIComponent(escape(atob($(this).data("keywords"))));
    
    var catId = $(this).parent("li").parent("ul").data("category");
    articleData.category = $("#category-title-"+catId).html();
    
    
    AbstractController.articleData = articleData;
    
    //console.log(JSON.stringify(articleData));
    
    Navigator.loadPage("abstract.html");
};