var CategoryConfigController = function() {
};

CategoryConfigController.categoryId = null;
CategoryConfigController.magazinesRemoved = [];
CategoryConfigController.magazinesSelected = [];


CategoryConfigController.prototype = {
    initialize: function() {
        App.$page.addClass("pref-bg");
        App.showBackButton();
        CategoryConfigController.startPage();
        CategoryConfigController.initListeners();
    },
    destroy: function() {
        App.hideBackButton();
        App.$page.removeClass("pref-bg");
        CategoryConfigController.categoryId = null;
        CategoryConfigController.magazinesRemoved = [];
        CategoryConfigController.magazinesSelected = [];
        PageLoad.ajxHandle = null;
    }
};

CategoryConfigController.initListeners = function(){
    $("#magazine-container").on('tap', ".magazine-checkbox", CategoryConfigController.magazineCheckbox);
    $("#magazine-container").on('tap', "#select-all", CategoryConfigController.selectAll);
};

CategoryConfigController.startPage = function(){
    $("#category-name").html(FeedsAndPublications.getCategoryName(CategoryConfigController.categoryId));
    
    var $magazinesTable = $("#magazines-table");
    
    var first = '<tr class="category-magazine-row">' +
                    '<td id="select-all"><img src="img/category/checkbox-partial.png"/></td>' +
                    '<td class="menu-text">Todos</td>' +
                '</tr>';
            
    $magazinesTable.append(first);
    
    var allMagazinesIds = FeedsAndPublications.getAllMagazinesIds(CategoryConfigController.categoryId);
    CategoryConfigController.magazinesRemoved = App.currentUser.getAllPublicationsExclusionsByFeed(CategoryConfigController.categoryId);
    
    for(var i in allMagazinesIds){
        var magazineId = allMagazinesIds[i];
        
        var img = "";
        if(CategoryConfigController.magazinesRemoved.indexOf(magazineId) < 0){
            img = 'checked';
            CategoryConfigController.magazinesSelected.push(magazineId);
        }else{
            img = 'unchecked';
        }
        
        
        var html = '<tr class="category-magazine-row">' +
                        '<td class="magazine-checkbox" data-magazine="'+magazineId+'"><img id="cb-img-'+magazineId+'" src="img/category/'+img+'.png"/></td>' +
                        '<td class="menu-text">'+FeedsAndPublications.getMagazineName(magazineId)+'</td>' +
                    '</tr>';
            
        $magazinesTable.append(html);
    }
    
    CategoryConfigController.refreshSelectAll();
};

CategoryConfigController.selectAll = function(){
    App.showLoadingScreen();
    
    var $obj = $(this).children("img");

    if ($obj.attr("src") === "img/category/unchecked.png") {

        $.when(
            Service.checkAllPublications(CategoryConfigController.categoryId)
        ).then(
            function(){
                $obj.attr("src", "img/category/checked.png");
                CategoryConfigController.magazinesSelected = CategoryConfigController.magazinesSelected.concat(CategoryConfigController.magazinesRemoved);
                for(var i in CategoryConfigController.magazinesRemoved){
                    var magazineId = CategoryConfigController.magazinesRemoved[i];
                    $("#cb-img-"+magazineId).attr("src", "img/category/checked.png");
                }
                CategoryConfigController.magazinesRemoved = [];
                
                App.hideLoadingScreen();
            },
            function (err) {
                App.hideLoadingScreen();
                App.showCommonInternetErrorDialog();
            }
        );
    } else {


        $.when(
            Service.uncheckAllPublications(CategoryConfigController.categoryId)
        ).then(
            function(){
                $obj.attr("src", "img/category/unchecked.png");
                CategoryConfigController.magazinesRemoved = CategoryConfigController.magazinesRemoved.concat(CategoryConfigController.magazinesSelected);
                for(var i in CategoryConfigController.magazinesSelected){
                    var magazineId = CategoryConfigController.magazinesSelected[i];
                    $("#cb-img-"+magazineId).attr("src", "img/category/unchecked.png");
                }
                CategoryConfigController.magazinesSelected = [];
                App.hideLoadingScreen();
            },
            function (err) {
                App.hideLoadingScreen();
                App.showCommonInternetErrorDialog();
            }
        );
    }
    
    // alterando a config de revistas a home eh diferente
    SciELO.homeCleanCache();
};

CategoryConfigController.refreshSelectAll = function(){
    if(CategoryConfigController.magazinesSelected.length < 1){
        $("#select-all").children("img").attr("src", "img/category/unchecked.png");
    }else if(CategoryConfigController.magazinesRemoved.length < 1){
        $("#select-all").children("img").attr("src", "img/category/checked.png");
    }else{
        $("#select-all").children("img").attr("src", "img/category/checkbox-partial.png");
    }
};


CategoryConfigController.magazineCheckbox = function(){
    App.showLoadingScreen();
        
    var magazineId = $(this).data("magazine");
    var $obj = $(this).children("img");

    if ($obj.attr("src") === "img/category/unchecked.png") {

        $.when(
            Service.checkPublication(CategoryConfigController.categoryId, magazineId)
        ).then(
            function(){
                $obj.attr("src", "img/category/checked.png");
                CategoryConfigController.magazinesSelected.push(magazineId);
                var index = CategoryConfigController.magazinesRemoved.indexOf(magazineId);
                if (index > -1) {
                    CategoryConfigController.magazinesRemoved.splice(index, 1);
                }
                CategoryConfigController.refreshSelectAll();
                App.hideLoadingScreen();
            },
            function (err) {
                App.hideLoadingScreen();
                App.showCommonInternetErrorDialog();
            }
        );
    } else {


        $.when(
            Service.uncheckPublication(CategoryConfigController.categoryId, magazineId)
        ).then(
            function(){
                $obj.attr("src", "img/category/unchecked.png");
                CategoryConfigController.magazinesRemoved.push(magazineId);
                var index = CategoryConfigController.magazinesSelected.indexOf(magazineId);
                if (index > -1) {
                    CategoryConfigController.magazinesSelected.splice(index, 1);
                }
                CategoryConfigController.refreshSelectAll();
                App.hideLoadingScreen();
            },
            function (err) {
                App.hideLoadingScreen();
                App.showCommonInternetErrorDialog();
            }
        );
    }
    
    // alterando a config de revistas a home eh diferente
    SciELO.homeCleanCache();
};