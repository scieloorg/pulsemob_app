var CategoryConfigController = function() {
};


CategoryConfigController.prototype = {
    initialize: function() {
        App.$page.addClass("pref-bg");
        App.showBackButton();
        CategoryConfigController.initListeners();
    },
    destroy: function() {
        App.hideBackButton();
        App.$page.removeClass("pref-bg");
        PageLoad.ajxHandle = null;
    }
};

CategoryConfigController.initListeners = function(){
    $("#magazine-container").on('tap', ".magazine-checkbox", CategoryConfigController.magazineCheckbox);
};

CategoryConfigController.magazineCheckbox = function(){
        var value = true;
        
        if($(this).children("img").attr("src") === "img/category/unchecked.png"){
            $(this).children("img").attr("src","img/category/checked.png");
        }else{
            $(this).children("img").attr("src","img/category/unchecked.png");
            value = false;
        }
        
        var data = {category: $(this).data("magazine"), value: value};
    };