var FeedConfigController = function() {
};

FeedConfigController.type = {
    SEARCH: 0,
    LETTER: 1,
    CATEGORY: 2,
    FEED_EDIT: 3
};

FeedConfigController.magazinesRemoved = [];
FeedConfigController.magazinesSelected = [];

FeedConfigController.selectedType = null;
FeedConfigController.filterData = null;


FeedConfigController.prototype = {
    initialize: function() {
        App.showBackButton();
        FeedConfigController.setHeader();
        FeedConfigController.startPage();
        FeedConfigController.initListeners();
        
        if(FeedConfigController.selectedType === FeedConfigController.type.FEED_EDIT){
            App.trackView("Editar Feed");
            App.trackEvent('Feed', 'Editar', App.currentUser.getFeedName(FeedConfigController.filterData));
        }else{
            App.trackView("Criar Feed");
        }
        
    },
    destroy: function() {
        App.hideBackButton();
        FeedConfigController.selectedType = null;
        FeedConfigController.filterData = null;
        FeedConfigController.searchResults = null;
        PageLoad.ajxHandle = null;
    }
};

FeedConfigController.initListeners = function(){
    $("#magazine-container").on('tap', ".magazine-checkbox", FeedConfigController.magazineCheckbox);
    $("#magazine-container").on('tap', "#select-all", FeedConfigController.selectAll);
    $("#category-header").on('tap', "#btn-save", FeedConfigController.save);
};

FeedConfigController.setHeader = function(){
    switch (FeedConfigController.selectedType) {
        case FeedConfigController.type.SEARCH:
            $("#category-name").html("PESQUISAR PERIÓDICOS");
            $("#search-container").show();
            $("#search-input").val(FeedConfigController.filterData.query);
            break;
        case FeedConfigController.type.LETTER:
            $("#category-name").html("LISTA ALFABÉTICA DE PERIÓDICOS");
            $("#letter-container").show();
            $("#letter-container").html(FeedConfigController.filterData);
            break;
        case FeedConfigController.type.CATEGORY:
            if(FeedConfigController.filterData === 0){
                $("#category-name").html("TODOS");
            }else{
                $("#category-name").html(DataMapping.getCategoryName(FeedConfigController.filterData));
            }
            break;
        default:
            // caso FeedConfigController.type.FEED_EDIT
            $("#category-name").html(App.currentUser.getFeedName(FeedConfigController.filterData));
            break;
    }
};

FeedConfigController.getMagazines = function(){
    switch (FeedConfigController.selectedType) {
        case FeedConfigController.type.SEARCH:
            return FeedConfigController.filterData.results;
            
        case FeedConfigController.type.LETTER:
            var magazinesByLetter = [];
            var allMagazines = DataMapping.getMagazinesOrder();
            var startCapture = false;
            for(var i in allMagazines){
                var magazineId = allMagazines[i];
                if(DataMapping.getMagazineName(magazineId).charAt(0) === FeedConfigController.filterData){
                    startCapture = true;
                    magazinesByLetter.push(magazineId);
                }else if(startCapture){
                    break;
                }
            }
            return magazinesByLetter;
            
        case FeedConfigController.type.CATEGORY:
            if(FeedConfigController.filterData === 0){
                return DataMapping.getMagazinesOrder(); // retorna todas as revistas
            }else{
                return DataMapping.getAllMagazinesIds(FeedConfigController.filterData);
            }
            
        default:
            // caso FeedConfigController.type.FEED_EDIT
            return App.currentUser.getFeedMagazines(FeedConfigController.filterData);
    }
};

FeedConfigController.startPage = function(){
    var $magazinesTable = $("#magazines-table");
    
    var first = '<tr class="category-magazine-row">' +
                    '<td id="select-all"><img src="img/category/checked.png"/></td>' +
                    '<td class="menu-text">Todos</td>' +
                '</tr>';
            
    $magazinesTable.append(first);
    
    var allMagazinesIds = FeedConfigController.getMagazines();
    
    for(var i in allMagazinesIds){
        var magazineId = allMagazinesIds[i];
        
        var html = '<tr class="category-magazine-row">' +
                        '<td class="magazine-checkbox" data-magazine="'+magazineId+'"><img id="cb-img-'+magazineId+'" src="img/category/checked.png"/></td>' +
                        '<td class="menu-text">'+DataMapping.getMagazineName(magazineId)+'</td>' +
                    '</tr>';
            
        $magazinesTable.append(html);
    }
    
    FeedConfigController.magazinesSelected = allMagazinesIds;
};

FeedConfigController.selectAll = function(){
    var $obj = $(this).children("img");

    if ($obj.attr("src") === "img/category/unchecked.png") {
        $obj.attr("src", "img/category/checked.png");
        FeedConfigController.magazinesSelected = FeedConfigController.magazinesSelected.concat(FeedConfigController.magazinesRemoved);
        for(var i in FeedConfigController.magazinesRemoved){
            var magazineId = FeedConfigController.magazinesRemoved[i];
            $("#cb-img-"+magazineId).attr("src", "img/category/checked.png");
        }
        FeedConfigController.magazinesRemoved = [];
    } else {
        $obj.attr("src", "img/category/unchecked.png");
        FeedConfigController.magazinesRemoved = FeedConfigController.magazinesRemoved.concat(FeedConfigController.magazinesSelected);
        for(var i in FeedConfigController.magazinesSelected){
            var magazineId = FeedConfigController.magazinesSelected[i];
            $("#cb-img-"+magazineId).attr("src", "img/category/unchecked.png");
        }
        FeedConfigController.magazinesSelected = [];
    }
};

FeedConfigController.refreshSelectAll = function(){
    if(FeedConfigController.magazinesSelected.length < 1){
        $("#select-all").children("img").attr("src", "img/category/unchecked.png");
    }else if(FeedConfigController.magazinesRemoved.length < 1){
        $("#select-all").children("img").attr("src", "img/category/checked.png");
    }else{
        $("#select-all").children("img").attr("src", "img/category/checkbox-partial.png");
    }
};

FeedConfigController.magazineCheckbox = function(){
    var magazineId = $(this).data("magazine");
    var $obj = $(this).children("img");

    if ($obj.attr("src") === "img/category/unchecked.png") {

        $obj.attr("src", "img/category/checked.png");
        FeedConfigController.magazinesSelected.push(magazineId);
        var index = FeedConfigController.magazinesRemoved.indexOf(magazineId);
        if (index > -1) {
            FeedConfigController.magazinesRemoved.splice(index, 1);
        }
        FeedConfigController.refreshSelectAll();
    } else {
        $obj.attr("src", "img/category/unchecked.png");
        FeedConfigController.magazinesRemoved.push(magazineId);
        var index = FeedConfigController.magazinesSelected.indexOf(magazineId);
        if (index > -1) {
            FeedConfigController.magazinesSelected.splice(index, 1);
        }
        FeedConfigController.refreshSelectAll();
    }
};

FeedConfigController.save = function(){
    
    // Caso esteja editando um feed, não deve ser exibido o popup
    if(FeedConfigController.selectedType === FeedConfigController.type.FEED_EDIT){
        FeedConfigController.saveEditFeed();
        return;
    }
    
    var isNewFeed = false;
    
    var $inputNewFeed = $('<input type="text" class="input-feed" style="display: none;" placeholder="Titulo da nova lista" />');
    
    var $selectFeedExistent = $('<select class="input-feed" style="display: none;"></select>');
    $selectFeedExistent.append('<option disabled="disabled" selected="selected">Selecione uma lista</option>');
    var allFeeds = App.currentUser.getFeeds();
    for (var i in allFeeds) {
        var feed = allFeeds[i];
        $selectFeedExistent.append('<option value="'+i+'">'+feed.feed_name+'</option>');
    }
    
    var dialog = new BootstrapDialog({
        title:"Salvar",
        message: function(dialogRef){
            var $container = $('<div></div>');
            
            var $btnsContainer = $('<div></div>');
            
            var $button = $('<div class="btn-save-feed">Nova lista</div>');
            $button.on('tap', {dialogRef: dialogRef}, function(event){
                isNewFeed = true;
                $btnsContainer.fadeOut(400,function(){
                    $inputNewFeed.fadeIn(400);
                    event.data.dialogRef.getModalFooter().fadeIn(400);
                });
            });
            
            var $button2 = $('<div class="btn-save-feed" style="margin-top: 20px;">Adicionar a uma lista existente</div>');
            $button2.on('tap', {dialogRef: dialogRef}, function(event){
                $btnsContainer.fadeOut(400,function(){
                    $selectFeedExistent.fadeIn(400);
                    event.data.dialogRef.getModalFooter().fadeIn(400);
                });
            });
            
            $btnsContainer.append($button);
            $btnsContainer.append($button2);
            
            $container.append($btnsContainer);
            $container.append($inputNewFeed);
            $container.append($selectFeedExistent);

            return $container;
        },
        buttons: [{
                label: 'Cancelar',
                cssClass: 'btn-default btn-ok',
                action: function(dialogRef){
                    dialogRef.close();
                }
            },
            {
                label: 'OK',
                cssClass: 'btn-default btn-ok',
                action: function(dialogRef){
                    if(isNewFeed){
                        var feedName = $inputNewFeed.val();
                        if(feedName){
                            FeedConfigController.createNewFeed(feedName);
                        }else{
                            App.showCommonDialog("Erro","Favor informar o nome da nova lista.");
                            return;
                        }
                        
                    }else{
                        var feedId = $selectFeedExistent.val();
                        if(feedId){
                            FeedConfigController.addToExistentFeed(feedId);
                        }else{
                            App.showCommonDialog("Erro","Favor selecionar uma lista.");
                            return;
                        }
                    }
                    dialogRef.close();
                }
            }
        ],
        closable: true
    });
    dialog.realize();
    dialog.getModalFooter().hide();
    dialog.open();
};

FeedConfigController.createNewFeed = function(feedName){
    App.showLoadingScreen();
    $.when(
        Service.createFeed(feedName, FeedConfigController.magazinesSelected)
    ).then(
        function(){
            SciELO.homeCleanCache();
            App.hideLoadingScreen();
            Navigator.loadPage("home.html");
        },
        function (err) {
            App.showCommonInternetErrorDialog();
            App.hideLoadingScreen();
        }
    );
};

FeedConfigController.addToExistentFeed = function(feedId){
    App.showLoadingScreen();
    $.when(
        Service.saveFeed(feedId, FeedConfigController.magazinesSelected, [])
    ).then(
        function(){
            SciELO.homeCleanCache();
            App.hideLoadingScreen();
            Navigator.loadPage("home.html");
        },
        function (err) {
            App.showCommonInternetErrorDialog();
            App.hideLoadingScreen();
        }
    );
};


FeedConfigController.saveEditFeed = function(){
    App.showLoadingScreen();
    $.when(
        Service.saveFeed(FeedConfigController.filterData, [], FeedConfigController.magazinesRemoved)
    ).then(
        function(){
            SciELO.homeCleanCache();
            App.hideLoadingScreen();
            Navigator.loadPage("home.html");
        },
        function (err) {
            App.showCommonInternetErrorDialog();
            App.hideLoadingScreen();
        }
    );
};
