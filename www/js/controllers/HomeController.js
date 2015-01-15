var HomeController = function() {
};

HomeController.scroll = {};
HomeController.$categories = null;

HomeController.prototype = {
    initialize: function() {
        HomeController.$categories = $("#categories");
        
        var category1 = {id: "scielo", name: "SciELO em Perspectiva"};
        HomeController.addCategory(category1);
        
        var category2 = {id: "agrarias", name: "Ciências Agrárias"};
        HomeController.addCategory(category2);
        
        HomeController.initListeners();
        Introduction.show();
    },
    destroy: function() {
        PageLoad.ajxHandle = null;
    }
};

HomeController.initListeners = function () {
    HomeController.$categories.on('tap', '.article-link', function(){ alert('Art: '+$(this).data("articleid"));});
        
    HomeController.$categories.on('tap', ".category-menu-btn", HomeController.toggleCategoryMenu);
    HomeController.$categories.on('tap', ".refresh-category", HomeController.categoryRefresh);
    HomeController.$categories.on('tap', ".share-category", HomeController.categoryShare);
    HomeController.$categories.on('tap', ".config-category", HomeController.categoryConfig);
    HomeController.$categories.on('tap', ".remove-category", HomeController.categoryRemove);
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
    
    alert("refresh "+catId);
};

HomeController.categoryShare = function () {
    var catId = $(this).data("category");
    $("#category-menu-"+catId).removeClass("context-menu-show");
    
    alert("share "+catId);
};

HomeController.categoryConfig = function () {
    var catId = $(this).data("category");
    $("#category-menu-"+catId).removeClass("context-menu-show");
    
    alert("config "+catId);
};

HomeController.categoryRemove = function () {
    var catId = $(this).data("category");
    $("#category-menu-"+catId).removeClass("context-menu-show");
    
    alert("remove "+catId);
};

HomeController.addCategory = function (categoryData) {
    var html = '<div class="category">' +
                    '<div class="category-bar">' +
                        '<table>' +
                            '<tr>' +
                                '<td class="category-bar-title">'+categoryData.name+'</td>' +
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
                            '<ul>' +
                                '<li class="article"></li>' +
                                '<li class="article"></li>' + 
                                '<li class="article"></li>' +
                                '<li class="article"></li>' +
                                '<li class="article"></li>' +
                                '<li class="article"></li>' +
                                '<li class="article"></li>' +
                                '<li class="article"></li>' +
                                '<li class="article"></li>' + 
                                '<li class="article"></li>' +
                            '</ul>' +
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
        infiniteLimit: 1000,
        dataset: HomeController.requestData,
        dataFiller: HomeController.updateContent,
        cacheSize: 50,
        category: categoryData.id
    });
    
};


HomeController.requestData = function (start, count) {
    var category = $(this)[0].options.category;
    setTimeout(function(){
        var data = [];
        
        for(var i = start; i < start+count; i++){
            var imgNum = i%5;
            var imgExt = ".gif";
            if(imgNum === 1) imgExt = ".jpeg";
            var art = {
                        id: i,
                        name: "Registro de ensaios clinicos sera especificado na Uniao Europeia"+i,
                        img: "img/glogo"+imgNum+""+imgExt,
                        type: "Geral "+category,
                        date: i+"/05/2014 - 2:01 pm"
                    };
            
            data.push(art);
        }
        HomeController.scroll[category].updateCache(start, data);
    }, 1000);
    
    /*ajax('dataset.php?start=' + +start + '&count=' + +count, {
            callback: function (data) {
                    data = JSON.parse(data);
                    myScroll.updateCache(start, data);
            }
    });*/
};

HomeController.updateContent = function (el, data) {
    if (typeof data !== 'undefined'){
        var html = '<div class="article-principal article-link" data-articleid="'+data.id+'">' +
                                '<img src="'+data.img+'" />' +
                                '<div class="article-name">' +
                                    data.name +
                                '</div>' +
                            '</div>' +
                            '<div class="article-legend article-link" data-articleid="'+data.id+'">' +
                                data.type+'<br>' + 
                                data.date +
                            '</div>';
        
        
        el.innerHTML = html;
    }
};
