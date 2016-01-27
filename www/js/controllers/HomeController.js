var HomeController = function() {
};

HomeController.firstData = {};
HomeController.scroll = {};
HomeController.$feeds = null;
HomeController.searchText = null;
HomeController.isFavoritePage = false;

HomeController.showAllMagazinesOfFeed = null;
HomeController.allFeeds = null;

HomeController.prototype = {
    initialize: function() {
        App.showLoadingScreen();
        HomeController.$feeds = $("#feeds");
        
        if(!$.isEmptyObject(App.currentUser.getFeeds())){
            HomeController.showHome();
        }else{
            $("#no-feeds").show();
            App.refreshScroll(true);
            App.hideLoadingScreen();
        }
        
        
        App.trackView("Home");
        HomeController.initListeners();
    },
    destroy: function() {
        PageLoad.ajxHandle = null;
        HomeController.showAllMagazinesOfFeed = null;
        HomeController.cleanData();
        
    },
    refresh: function(){
        App.showLoadingScreen();
        HomeController.firstData = {};
        HomeController.scroll = {};
        HomeController.$feeds.html("");
        
        SciELO.homeCleanCache();
        HomeController.showHome();
        
    }
};


HomeController.cleanData = function(){
    HomeController.firstData = {};
    HomeController.scroll = {};
    HomeController.searchText = null;
    HomeController.isFavoritePage = false;
    HomeController.allFeeds = null;
};


HomeController.showHome = function () {
    
    HomeController.$feeds.html("");
    
    $.when(
        SciELO.home()
    ).then(
        function (json) {
            if(HomeController.showAllMagazinesOfFeed){
                HomeController.allFeeds = [App.currentUser.getFeed(HomeController.showAllMagazinesOfFeed)];
            }else{
                HomeController.allFeeds = App.currentUser.getFeeds();
            }
            
            for (var feedId in HomeController.allFeeds) {
                var feed = HomeController.allFeeds[feedId];
                var magazines = feed.magazines;
                
                //TODO: incluir html por feed
                HomeController.addFeed(HomeController.$feeds, feedId, feed.feed_name, HomeController.showAllMagazinesOfFeed === null);
                
                var $magazinesContainer = $("#magazines-from-feed-"+feedId);
                
                var count = 0;
                for(var j in magazines){
                    if(count > 2 && HomeController.showAllMagazinesOfFeed === null){
                        // mostrar apenas as primeiras 3 revistas
                        $("#feed-footer-"+feedId).show();
                        break; 
                    } 
                    var magazineId = magazines[j];
                    var magazineFeedId = magazineId+"_"+feedId;
                 
                    if(json[magazineId]){
                        var magazineData = json[magazineId];
                        
                        if(magazineData.docs.length < 1) continue;

                        HomeController.firstData[magazineFeedId] = magazineData.docs;

                        var limitScroll = (magazineData.numFound > 1000) ? 1000 : magazineData.numFound;
                        var cacheSize = magazineData.docs.length;
                        var minElements = (magazineData.docs.length > 10) ? 10 : magazineData.docs.length;

                        count++;
                        HomeController.addMagazine($magazinesContainer,{id: magazineFeedId, magazineId: magazineId, feedId: feedId, name: DataMapping.getMagazineName(magazineId), minElements: minElements, limit: limitScroll, cacheSize: cacheSize});
                    }else if(HomeController.showAllMagazinesOfFeed !== null){
                        var html = HomeController.createMagazineHTML(magazineFeedId, feedId, magazineId, DataMapping.getMagazineName(magazineId), 1);
                        $magazinesContainer.append(html);
                        
                        HomeController.reloadMagazine(magazineFeedId, magazineId);
                    }
                }
            }
            
            App.refreshScroll(true);
            App.hideLoadingScreen();
            
            // mostrar introducao na primeira vez que abrir a home
            if(!SciELO.hasCache(App.constants.INTRODUCTION_SHOW,false)){
                Introduction.show();
                SciELO.saveCache(App.constants.INTRODUCTION_SHOW, {show: true}, false);
            }
            
        },
        function (err) {
            App.trackException("Error Loading Home: "+JSON.stringify(err));
            App.hideLoadingScreen();
            App.showCommonInternetErrorDialog();
            return;
        }
    );
    
};

HomeController.addFeed = function($feedsContainer, feedId, feedName, isDefaultFooter){
    var html = '<div id="feed-'+feedId+'" class="feed">' +
                    '<table class="feed-header">' +
                        '<tr>';
                
    if(!isDefaultFooter) html += '<td class="back-to-home"><img alt="" src="img/home/back-arrow-white.png"/></td>';
    
    html +=                 '<td>'+feedName+'</td>' +
                            '<td class="feed-menu-btn" data-feed="'+feedId+'"><img alt="" src="img/home/menu_icon.png"/></td>' +
                        '</tr>' +
                    '</table>' +
                    '<div class="section-content">' +
                        '<div id="feed-menu-'+feedId+'" class="pop-menu">' +
                            '<div class="pop-menu-content">' +
                                '<table>' +
                                    '<tr class="context-menu-row refresh-feed" data-feed="'+feedId+'">' +
                                        '<td class="context-menu-icon"><img src="img/feed/refresh.png"/></td>' +
                                        '<td class="item-text context-menu-text"><div>'+Localization.getValue('refresh')+'</div></td>' +
                                    '</tr>' +
                                    '<tr class="context-menu-row config-feed" data-feed="'+feedId+'">' +
                                        '<td class="context-menu-icon"><img src="img/feed/config.png"/></td>' +
                                        '<td class="item-text context-menu-text"><div>'+Localization.getValue('config')+'</div></td>' +
                                    '</tr>' +
                                    '<tr class="context-menu-row remove-feed" data-feed="'+feedId+'">' +
                                        '<td class="context-menu-icon"><img src="img/feed/remove.png"/></td>' +
                                        '<td class="item-text context-menu-text"><div>'+Localization.getValue('remove')+'</div></td>' +
                                    '</tr>' +
                                '</table>' +
                            '</div>' +
                        '</div>' +
                        '<div id="magazines-from-feed-'+feedId+'"></div>' +
                    '</div>';
            
    if(isDefaultFooter){
        html +=     '<table id="feed-footer-'+feedId+'" style="display: none;" class="feed-footer" data-feed="'+feedId+'">' +
                        '<tr>' +
                            '<td class="footer-desc">'+Localization.getValue('more-in')+' </td>' +
                            '<td class="footer-name">'+feedName+'</td>' +
                            '<td class="footer-img"><img alt="" src="img/home/more-arrow.png"/></td>' +
                        '</tr>' +
                    '</table>';
    }else{
        //voltar para home
        html +=     '<div class="feed-footer back-to-home">' +
                        '<div class="footer-img"><img alt="" src="img/home/back-arrow.png"/></div>' +
                        '<div class="footer-desc">'+Localization.getValue('back-to')+' </div>' +
                        '<div>'+Localization.getValue('my-feed')+'</div>' +
                    '</div>';
    }
            
            
    html +=     '</div>';
    
    $feedsContainer.append(html);
};


HomeController.initListeners = function () {
    HomeController.$feeds.on('tap', '.article-link', ArticleUtils.openArticle);
    
    HomeController.$feeds.on('tap', ".feed-menu-btn", HomeController.toggleFeedMenu);
    HomeController.$feeds.on('tap', ".refresh-feed", HomeController.feedRefresh);
    HomeController.$feeds.on('tap', ".config-feed", HomeController.feedConfig);
    HomeController.$feeds.on('tap', ".remove-feed", HomeController.feedRemoveEvent);
    
        
    HomeController.$feeds.on('tap', ".magazine-menu-btn", HomeController.toggleMagazineMenu);
    HomeController.$feeds.on('tap', ".refresh-magazine", HomeController.magazineRefresh);
    HomeController.$feeds.on('tap', ".share-magazine", HomeController.magazineShare);
    HomeController.$feeds.on('tap', ".remove-magazine", HomeController.magazineRemove);
    
    HomeController.$feeds.on('tap', ".feed-footer", HomeController.showAllMagazines);
    HomeController.$feeds.on('tap', ".back-to-home", HomeController.showAllFeeds);
};

HomeController.toggleFeedMenu = function (event) {
    var feedId = $(this).data("feed");
    var $menu = $("#feed-menu-"+feedId);
    
    if ($menu.hasClass("context-menu-show")) {
        $menu.removeClass("context-menu-show");
    } else {
        $(".context-menu-show").removeClass("context-menu-show");
        $menu.addClass("context-menu-show");
    }
    
    event.stopPropagation();
};

HomeController.feedRefresh = function () {
    var feedId = $(this).data("feed");
    
    $("#magazines-from-feed-"+feedId+" .refresh-magazine").trigger("tap");
};

HomeController.feedConfig = function () {
    var feedId = $(this).data("feed");
    
    FeedConfigController.selectedType = FeedConfigController.type.FEED_EDIT;
    FeedConfigController.filterData = feedId;
    Navigator.loadPage("feedConfig.html");
};

HomeController.feedRemoveEvent = function () {
    var feedId = $(this).data("feed");
    HomeController.feedRemove(feedId);
    
};

HomeController.feedRemove = function (feedId) {
    $("#feed-" + feedId).fadeOut(800, function () {
        $("#feed-" + feedId).remove();
        if (HomeController.$feeds.html() === "") {
            $("#no-feeds").show();
        }
        App.refreshScroll(false);
    });

    var feedName = App.currentUser.getFeedName(feedId);

    Service.deleteFeed(feedId);
    SciELO.homeCleanCache();

    App.trackEvent('Feed', 'Apagar', feedName);
};

HomeController.showAllMagazines = function(){
    var feedId = $(this).data("feed");
    
    HomeController.showAllMagazinesOfFeed = feedId;
    HomeController.$feeds.html("");
    HomeController.showHome();
};

HomeController.showAllFeeds = function(){
    HomeController.showAllMagazinesOfFeed = null;
    HomeController.$feeds.html("");
    HomeController.showHome();
};

HomeController.toggleMagazineMenu = function (event) {
    var magazineFeedId = $(this).data("magazinefeed");
    var $menu = $("#magazine-menu-"+magazineFeedId);
    
    if ($menu.hasClass("context-menu-show")) {
        $menu.removeClass("context-menu-show");
    } else {
        $(".context-menu-show").removeClass("context-menu-show");
        $menu.addClass("context-menu-show");
    }
    
    event.stopPropagation();
};

HomeController.magazineRefresh = function () {
    var feedId = $(this).data("feed");
    var magazineId = $(this).data("magazine");
    var magazineFeedId = magazineId+"_"+feedId;
    
    HomeController.reloadMagazine(magazineFeedId, magazineId);
    App.trackEvent('Revista', 'Recarregar', DataMapping.getMagazineName(magazineId));
};

HomeController.reloadMagazine = function(magazineFeedId, magazineId){
    var query = "journal_id:"+magazineId;
        
    var params = {q: query, start: 0};

    $.when(
            SciELO.magazine(params) 
    ).then( 
        function(json){
            HomeController.firstData[magazineFeedId] = json.response.docs;
            if(HomeController.scroll[magazineFeedId]) HomeController.scroll[magazineFeedId].destroy();
            
            var limitScroll = (json.response.numFound > 1000) ? 1000 : json.response.numFound;
            var cacheSize = json.response.docs.length;
            var minElements = (json.response.docs.length > 10) ? 10 : json.response.docs.length;
            
            
            var $ul = $("#magazine-scroller-"+magazineFeedId+" ul");
            $ul.html("");
            
            var html = "";
            for(var i=0; i<minElements ;i++){
                html += '<li class="article"><img class="loading-img" src="img/loading.gif"/></li>';
            }

            $ul.html(html);

            HomeController.scroll[magazineFeedId] = new IScroll('#magazine-wrapper-'+magazineFeedId, {
                scrollX: true,
                scrollY: false,
                mouseWheel: false,
                infiniteElements: '#magazine-scroller-'+magazineFeedId+' .article',
                infiniteLimit: limitScroll,
                dataset: HomeController.requestData,
                dataFiller: ArticleUtils.updateContent,
                cacheSize: cacheSize,
                magazineFeedId: magazineFeedId,
                magazineId: magazineId
            });
            
        }, 
        function(err){
            App.trackException("Error Refresh Category: "+JSON.stringify(err));
            App.showCommonInternetErrorDialog();
            return;
        }
    );
};


HomeController.magazineShare = function () {
    var magazineId = $(this).data("magazine");
    
    var domain = DataMapping.getMagazineDomain(magazineId);
    var issn = DataMapping.getMagazineISSN(magazineId);
    var magainzeName = DataMapping.getMagazineName(magazineId);

    window.plugins.socialsharing.share(magainzeName+" -", "SciELO Mobile", null, "http://"+domain+"/scielo.php?script=sci_serial&pid="+issn+"&lng="+App.locale);
    
    App.trackEvent('Revista', 'Compartilhar', magainzeName);
};

HomeController.magazineRemove = function () {
    var feedId = $(this).data("feed");
    var magazineId = $(this).data("magazine");
    var magazineFeedId = magazineId + "_" + feedId;

    if (HomeController.allFeeds[feedId].magazines.length === 1) {
        App.showCommonQuestionDialog("SciELO", Localization.getValue('remove-feed'), Localization.getValue('yes'), function () {
            HomeController.feedRemove(feedId);
        }, Localization.getValue('no'), null);

    } else {
        $("#magazine-" + magazineFeedId).fadeOut(800, function () {
            $("#magazine-" + magazineFeedId).remove();
            App.refreshScroll(false);
        });

        Service.saveFeed(feedId, [], [magazineId]);
        SciELO.homeCleanCache();
        var index = HomeController.allFeeds[feedId].magazines.indexOf(magazineId);
        HomeController.allFeeds[feedId].magazines.splice(index, 1);
        HomeController.preAddMagazine(feedId);
    }

    App.trackEvent('Revista', 'Dispensar', DataMapping.getMagazineName(magazineId));
};

HomeController.addMagazine = function ($magazinesContainer, magazineFeedData) {
    
    var html = HomeController.createMagazineHTML(magazineFeedData.id, magazineFeedData.feedId, magazineFeedData.magazineId, magazineFeedData.name, magazineFeedData.minElements);
    
    $magazinesContainer.append(html);

    HomeController.scroll[magazineFeedData.id] = new IScroll('#magazine-wrapper-'+magazineFeedData.id, { 
        scrollX: true,
        scrollY: false,
        mouseWheel: false,
        infiniteElements: '#magazine-scroller-'+magazineFeedData.id+' .article',
        infiniteLimit: magazineFeedData.limit,
        dataset: HomeController.requestData,
        dataFiller: ArticleUtils.updateContent,
        cacheSize: magazineFeedData.cacheSize,
        magazineFeedId: magazineFeedData.id,
        magazineId: magazineFeedData.magazineId
    });
};

HomeController.createMagazineHTML = function (magazineFeedId, feedId, magazineId, magazineName, minElements) {
    var html = '<div id="magazine-'+magazineFeedId+'" class="magazine">' +
                    '<div class="magazine-bar">' +
                        '<table>' +
                            '<tr>' +
                                '<td id="magazine-bar-'+magazineFeedId+'" class="magazine-bar-title">'+magazineName+'</td>' +
                                '<td class="magazine-menu-btn" data-magazinefeed="'+magazineFeedId+'" ><img src="img/home/menu_icon.png"/></td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                    '<div class="section-content">' +
                        '<div id="magazine-menu-'+magazineFeedId+'" class="pop-menu">' +
                            '<div class="pop-menu-content">' +
                                '<table>'+
                                    '<tr class="context-menu-row refresh-magazine" data-magazine="'+magazineId+'" data-feed="'+feedId+'" >' +
                                        '<td class="context-menu-icon"><img src="img/feed/refresh.png"/></td>' +
                                        '<td class="item-text context-menu-text"><div>'+Localization.getValue('refresh')+'</div></td>' +
                                    '</tr>' +
                                    '<tr class="context-menu-row share-magazine" data-magazine="'+magazineId+'" >' +
                                        '<td class="context-menu-icon"><img src="img/feed/share.png"/></td>' +
                                        '<td class="item-text context-menu-text"><div>'+Localization.getValue('share')+'</div></td>' +
                                    '</tr>' +
                                    '<tr class="context-menu-row remove-magazine" data-magazine="'+magazineId+'" data-feed="'+feedId+'" >' +
                                        '<td class="context-menu-icon"><img src="img/feed/remove.png"/></td>' +
                                        '<td class="item-text context-menu-text"><div>'+Localization.getValue('remove')+'</div></td>' +
                                    '</tr>' +
                                '</table>' +
                            '</div>' +
                        '</div>' +
                        '<div id="magazine-wrapper-'+magazineFeedId+'" class="wrapper">' +
                            '<div id="magazine-scroller-'+magazineFeedId+'" class="scroller magazine-scroller" >' +
                                '<ul data-magazine="'+magazineFeedId+'">';

    for(var i=0; i<minElements ;i++){
        html +=                     '<li class="article"><img class="loading-img" src="img/loading.gif"/></li>';
    }

    html +=                         '</ul>' +
                                '</div>' +
                            '</div>' +
                            '</div>' +
                        '</div>';
                
    return html;
};

HomeController.requestData = function (start, count) {
    var magazineFeedId = $(this)[0].options.magazineFeedId;
    var magazineId = $(this)[0].options.magazineId;
    
    if(start === 0){
        setTimeout(function(){
            if(HomeController.scroll[magazineFeedId]){
                HomeController.scroll[magazineFeedId].updateCache(start, HomeController.firstData[magazineFeedId]);
            }
        },500);
        
    } else {
        
        var query = "journal_id:"+magazineId;
        
        var params = {q: query, start: start, rows: count};
        
        $.when(
                SciELO.magazine(params) 
        ).then( 
            function(json){
                HomeController.scroll[magazineFeedId].updateCache(start, json.response.docs);
            }, 
            function(err){
                App.trackException("Error on requestData: "+JSON.stringify(err));
            }
        );
    }
};

HomeController.preAddMagazine = function (feedId) {
    var feed = HomeController.allFeeds[feedId];
    var magazines = feed.magazines;

    var $magazinesContainer = $("#magazines-from-feed-" + feedId);
    if (magazines.length < 3) {
        return;
    }
    var magazineId = magazines[2];
    var magazineFeedId = magazineId + "_" + feedId;

    var html = HomeController.createMagazineHTML(magazineFeedId, feedId, magazineId, DataMapping.getMagazineName(magazineId), 1);
    $magazinesContainer.append(html);
    HomeController.reloadMagazine(magazineFeedId, magazineId);
};

