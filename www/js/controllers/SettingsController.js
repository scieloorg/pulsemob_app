var SettingsController = function () {
};

SettingsController.prototype = {
    initialize: function () {
        App.showBackButton();
        App.trackView("Settings");
        
        SettingsController.listCollections();
        
    },
    destroy: function () {
        App.hideBackButton();
        PageLoad.ajxHandle = null;
    }
};

SettingsController.initAll = function(){
    SettingsController.initCollectionsSection()
    SettingsController.initAlphabeticalOrderFilter();
    SettingsController.initCategorySection();
    SettingsController.initFeedsSection();
    SettingsController.initListeners();
}

SettingsController.listCollections = function(){
        
        $.when(
            Service.listCollections()
        ).then(
            function (json) {
                App.collection = json;
                $.each( App.collection, function( key, value ) {
                    App.collectionsSelected.push(value[1]);
                }); 
                SettingsController.initAll();
            },
            function (err) {               
//                App.trackException("Error Loading Collections: "+JSON.stringify(err));
//                App.collection = collection;
//            
//                $.each( App.collection, function( key, value ) {
//                    App.collectionsSelected.push(value[1]);
//                });            
                SettingsController.initAll();
                return;                
            }
        );
    };

SettingsController.getCollectionDomain = function (key){
    return App.collection[key][1];
};

SettingsController.initCollectionsSection = function () {
    var $collectionSection = $("#collection-section");
    $collectionSection.html("");
    
    
    
    var first = '<div class="feed-config-collection-row col-xs-12">' +
                    '<img id="select-all" src="">' +
                    '<span class="menu-text">TODAS</span>' +
                '</div>';

    $collectionSection.append(first);
    
    SettingsController.refreshSelectAll();
    
    $.each( App.collection, function( key, value ) {
        var imgString;
        if(App.collectionsSelected.indexOf(value[1])> -1){
            imgString =  'img/category/checked.png';    
        }else{
            imgString = 'img/category/unchecked.png';
        }
        $collectionSection.append(
            '<div  class="feed-config-collection-row col-xs-6">' +                
                '<img class="collection-checkbox" data-collection="'+value[1]+'" id="cb-img-'+value[1]+'" src="'+imgString+'">' +
                '<span class="menu-text">'+JSON.parse('"' + value[0].replace(/\"/g, '\\"') + '"')+'</span>' +
            '</div>'
        );
    });   
    
    
    
};

SettingsController.initAlphabeticalOrderFilter = function () {
    var alphaASC = new Array();
    for (var i = 0; i < 256; i++) {
        alphaASC.push(0);
    }
    var magazines = DataMapping.getAllMagazines();
    for (var id in magazines) {
        var magazine = magazines[id];
        var charMag = magazine.magazine_name.charCodeAt(0);
        alphaASC[charMag] = 1;
    }
    for (var i = 0; i < alphaASC.length; i++) {
        if (alphaASC[i+1] === 1) {
            $("#letter-" + String.fromCharCode(i+1)).show();
        }
    }
};

SettingsController.checkAlfabeticSection = function () {
    var leters = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
    
    $.each( leters, function( key, letter ) {
        
        var magazinesByLetter = [];
        var allMagazines = DataMapping.getMagazinesOrder();
        var startCapture = false;
        for(var i in allMagazines){
            var magazineId = allMagazines[i];
            if(DataMapping.getMagazineName(magazineId).charAt(0) === letter){
                startCapture = true;
                magazinesByLetter.push(magazineId);
            }else if(startCapture){
                break;
            }
        }
        
        var letterInColection  = false;
        
        $.each( magazinesByLetter, function( key, value ) {            
            if( App.collectionsSelected.indexOf( DataMapping.getMagazineDomain(value)) > -1 ){     
                letterInColection = true;
            }            
        });              
        
        if(letterInColection){
            $("#letter-"+letter).show();
        }else{
             $("#letter-"+letter).hide();
        }
        
    });
    
};

SettingsController.initCategorySection = function () {
    var $categorySection = $("#category-section");
    $categorySection.html("");

    // opcao de mostrar todas revistas
    $categorySection.append('<tr class="settings-category settings-row" data-categoryid="0">' +
            '<td class="settings-category-name">' + Localization.getValue("all") + '</td>' +
            '<td class="settings-arrow"><img src="img/settings/arrow.png" /></td>' +
            '</tr>');

    var allCategories = DataMapping.getCategoriesOrder();
    for (var i in allCategories) {
        var cat = parseInt(allCategories[i]);
        
        var magazines = DataMapping.getAllMagazinesIds(cat);      
        var categoriaInColection  = false;
        
        $.each( magazines, function( key, value ) {            
            if( App.collectionsSelected.indexOf( DataMapping.getMagazineDomain(value)) > -1 ){     
                categoriaInColection = true;
            }            
        });
        
        if(categoriaInColection){
            var html = '<tr class="settings-category settings-row" data-categoryid="' + cat + '">' +
                    '<td class="settings-category-name">' + DataMapping.getCategoryName(cat) + '</td>' +
                    '<td class="settings-arrow"><img src="img/settings/arrow.png" /></td>' +
                    '</tr>';

            $categorySection.append(html);
        }
    }
};

SettingsController.initFeedsSection = function () {
    var $myListsSection = $("#feeds-section");
    $myListsSection.html("");

    var allFeeds = App.currentUser.getFeeds();
    for (var i in allFeeds) {
        var feed = allFeeds[i];

        var html = '<tr class="settings-feed settings-row" data-feedid="' + i + '">' +
                '<td class="settings-list"><img src="img/settings/list.png" /></td>' +
                '<td>' + feed.feed_name + '</td>' +
                '<td class="settings-arrow"><img src="img/settings/arrow.png" /></td>' +
                '</tr>';

        $myListsSection.append(html);
    }
};

SettingsController.initListeners = function () {
    $("#collection-container").on('tap', ".collection-checkbox", SettingsController.collectionCheckbox);
    $("#collection-container").on('tap', "#select-all", SettingsController.selectAll);
    $("#collection-container").on('tap', ".collection-checkbox", SettingsController.initCategorySection);
    $("#collection-container").on('tap', "#select-all", SettingsController.initCategorySection);
    $("#collection-container").on('tap', ".collection-checkbox", SettingsController.checkAlfabeticSection);
    $("#collection-container").on('tap', "#select-all", SettingsController.checkAlfabeticSection);
    $("#settings").on("tap", "#btn-search-magazines", SettingsController.filterSearch);
    $("#settings").on("tap", ".settings-letter", SettingsController.filterLetter);
    $("#settings").on("tap", ".settings-category", SettingsController.filterCategory);
    $("#settings").on("tap", ".settings-feed", SettingsController.filterFeed);
};

SettingsController.selectAll = function(){
    var $obj = $(this);

    if ($obj.attr("src") === "img/category/unchecked.png") {
        $obj.attr("src", "img/category/checked.png");
        App.collectionsSelected = App.collectionsSelected.concat(App.collectionsRemoved);
        for(var i in App.collectionsRemoved){
            var collectionKey = App.collectionsRemoved[i];
            $(document.getElementById("cb-img-"+collectionKey)).attr("src", "img/category/checked.png");
        }
        App.collectionsRemoved = [];
    } else {
        $obj.attr("src", "img/category/unchecked.png");
        App.collectionsRemoved = App.collectionsRemoved.concat(App.collectionsSelected);
        for(var i in App.collectionsSelected){
            var collectionKey = App.collectionsSelected[i];
            $(document.getElementById("cb-img-"+collectionKey)).attr("src", "img/category/unchecked.png");
        }
        App.collectionsSelected = [];
    }
};

SettingsController.collectionCheckbox = function(){
    var collectionKey = $(this).data("collection");
    var $obj = $(this);
    
    if ($obj.attr("src") === "img/category/unchecked.png") {
        $obj.attr("src", "img/category/checked.png");
        App.collectionsSelected.push(collectionKey);
        var index = App.collectionsRemoved.indexOf(collectionKey);
        if (index > -1) {
            App.collectionsRemoved.splice(index, 1);
        }
        SettingsController.refreshSelectAll();        
    } else {
        $obj.attr("src", "img/category/unchecked.png");
        App.collectionsRemoved.push(collectionKey);
        var index = App.collectionsSelected.indexOf(collectionKey);
        if (index > -1) {
            App.collectionsSelected.splice(index, 1);
        }
        SettingsController.refreshSelectAll();
    }
};

SettingsController.refreshSelectAll = function(){
    if(App.collectionsSelected.length < 1){
        $("#select-all").attr("src", "img/category/unchecked.png");
    }else if(App.collectionsRemoved.length < 1){
        $("#select-all").attr("src", "img/category/checked.png");
    }else{
        $("#select-all").attr("src", "img/category/checkbox-partial.png");
    }
};

SettingsController.filterSearch = function () {
    App.showLoadingScreen();
    FeedConfigController.selectedType = FeedConfigController.type.SEARCH;
    var searchQuery = $("#search-input").val();

    $.when(
            SciELO.searchMagazines(searchQuery)
            ).then(
            function (data) {
                // It worked
                FeedConfigController.filterData = {query: searchQuery, results: data};
                Navigator.loadPage("feedConfig.html");
                App.hideLoadingScreen();
            },
            function () {
                //TODO: add msg error
                App.hideLoadingScreen();
            }
    );
};

SettingsController.filterLetter = function () {
    FeedConfigController.selectedType = FeedConfigController.type.LETTER;
    FeedConfigController.filterData = $(this).html();
    Navigator.loadPage("feedConfig.html");
};

SettingsController.filterCategory = function () {
    FeedConfigController.selectedType = FeedConfigController.type.CATEGORY;
    FeedConfigController.filterData = $(this).data("categoryid");
    Navigator.loadPage("feedConfig.html");
};

SettingsController.filterFeed = function () {
    FeedConfigController.selectedType = FeedConfigController.type.FEED_EDIT;
    FeedConfigController.filterData = $(this).data("feedid");
    Navigator.loadPage("feedConfig.html");
};