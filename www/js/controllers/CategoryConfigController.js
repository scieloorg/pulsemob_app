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
        
        try{
            analytics.trackView("Configurar Categoria");
            analytics.trackEvent('Categoria', 'Configurar', FeedsAndPublications.getCategoryName(CategoryConfigController.categoryId), 1);
        }catch(err){
            console.log(err);
        }
    },
    destroy: function() {
        App.hideBackButton();
        App.$page.removeClass("pref-bg");
        CategoryConfigController.sendToServer();
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
    var $obj = $(this).children("img");

    if ($obj.attr("src") === "img/category/unchecked.png") {
        $obj.attr("src", "img/category/checked.png");
        CategoryConfigController.magazinesSelected = CategoryConfigController.magazinesSelected.concat(CategoryConfigController.magazinesRemoved);
        for(var i in CategoryConfigController.magazinesRemoved){
            var magazineId = CategoryConfigController.magazinesRemoved[i];
            $("#cb-img-"+magazineId).attr("src", "img/category/checked.png");
        }
        CategoryConfigController.magazinesRemoved = [];
        
        try{
            analytics.trackEvent('Revista', 'Adicionar', 'Todas', 1);
        }catch(err){
            console.log(err);
        }
    } else {
        $obj.attr("src", "img/category/unchecked.png");
        CategoryConfigController.magazinesRemoved = CategoryConfigController.magazinesRemoved.concat(CategoryConfigController.magazinesSelected);
        for(var i in CategoryConfigController.magazinesSelected){
            var magazineId = CategoryConfigController.magazinesSelected[i];
            $("#cb-img-"+magazineId).attr("src", "img/category/unchecked.png");
        }
        CategoryConfigController.magazinesSelected = [];

        try{
            analytics.trackEvent('Revista', 'Remover', 'Todas', 1);
        }catch(err){
            console.log(err);
        }
    }
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
    var magazineId = $(this).data("magazine");
    var $obj = $(this).children("img");

    if ($obj.attr("src") === "img/category/unchecked.png") {

        $obj.attr("src", "img/category/checked.png");
        CategoryConfigController.magazinesSelected.push(magazineId);
        var index = CategoryConfigController.magazinesRemoved.indexOf(magazineId);
        if (index > -1) {
            CategoryConfigController.magazinesRemoved.splice(index, 1);
        }
        CategoryConfigController.refreshSelectAll();

        try{
            analytics.trackEvent('Revista', 'Adicionar', FeedsAndPublications.getMagazineName(magazineId), 1);
        }catch(err){
            console.log(err);
        }
    } else {
        $obj.attr("src", "img/category/unchecked.png");
        CategoryConfigController.magazinesRemoved.push(magazineId);
        var index = CategoryConfigController.magazinesSelected.indexOf(magazineId);
        if (index > -1) {
            CategoryConfigController.magazinesSelected.splice(index, 1);
        }
        CategoryConfigController.refreshSelectAll();

        try{
            analytics.trackEvent('Revista', 'Remover', FeedsAndPublications.getMagazineName(magazineId), 1);
        }catch(err){
            console.log(err);
        }
    }
};

CategoryConfigController.sendToServer = function(){
    var currentExclusions = App.currentUser.getAllPublicationsExclusionsByFeed(CategoryConfigController.categoryId);
    
    var add = $(currentExclusions).not(CategoryConfigController.magazinesRemoved).get();
    var remove = $(CategoryConfigController.magazinesRemoved).not(currentExclusions).get();
    
    if(add.length > 0 || remove.length > 0){
        var publications = {add:add, remove:remove};

        $.when(
            Service.savePublications(CategoryConfigController.categoryId, publications)
        ).then(
            function(){
                // alterando a config de revistas a home eh diferente
                SciELO.homeCleanCache();
            },
            function (err) {
                App.showCommonInternetErrorDialog();
            }
        );
    }
    
    CategoryConfigController.categoryId = null;
    CategoryConfigController.magazinesRemoved = [];
    CategoryConfigController.magazinesSelected = [];
};