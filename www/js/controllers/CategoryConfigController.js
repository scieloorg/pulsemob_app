var CategoryConfigController = function() {
};

CategoryConfigController.categoryId = null;


CategoryConfigController.prototype = {
    initialize: function() {
        App.$page.addClass("pref-bg");
        App.showBackButton();
        CategoryConfigController.initListeners();
        CategoryConfigController.startPage();
    },
    destroy: function() {
        App.hideBackButton();
        App.$page.removeClass("pref-bg");
        CategoryConfigController.categoryId = null;
        PageLoad.ajxHandle = null;
    }
};

CategoryConfigController.initListeners = function(){
    $("#magazine-container").on('tap', ".magazine-checkbox", CategoryConfigController.magazineCheckbox);
};

CategoryConfigController.startPage = function(){
    $("#category-name").html(FeedsAndPublications.getCategoryName(CategoryConfigController.categoryId));
    
    var $magazinesTable = $("#magazines-table");
    
    var allMagazinesIds = FeedsAndPublications.getAllMagazinesIds(CategoryConfigController.categoryId);
    var magazinesRemoved = [7,19]; //TODO: pegar do usuario
    
    for(var i in allMagazinesIds){
        var magazineId = allMagazinesIds[i];
        
        var img = (magazinesRemoved.indexOf(magazineId) < 0) ? 'checked' : 'unchecked';
        
        var html = '<tr class="category-magazine-row">' +
                        '<td class="magazine-checkbox" data-magazine="'+magazineId+'"><img src="img/category/'+img+'.png"/></td>' +
                        '<td class="menu-text">'+FeedsAndPublications.getMagazineName(magazineId)+'</td>' +
                    '</tr>';
            
        $magazinesTable.append(html);
    }
};

CategoryConfigController.magazineCheckbox = function(){
    var value = true;

    if($(this).children("img").attr("src") === "img/category/unchecked.png"){
        $(this).children("img").attr("src","img/category/checked.png");
    }else{
        $(this).children("img").attr("src","img/category/unchecked.png");
        value = false;
    }
    
    // alterando a config de revistas a home eh diferente
    SciELO.homeCleanCache();
    
    var data = {category: $(this).data("magazine"), value: value};
};