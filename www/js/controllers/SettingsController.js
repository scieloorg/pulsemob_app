var SettingsController = function () {
};

SettingsController.prototype = {
    initialize: function () {
        App.showBackButton();
        App.trackView("Settings");

        SettingsController.initAlphabeticalOrderFilter();
        SettingsController.initCategorySection();
        SettingsController.initFeedsSection();
        SettingsController.initListeners();
    },
    destroy: function () {
        App.hideBackButton();
        PageLoad.ajxHandle = null;
    }
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

        var html = '<tr class="settings-category settings-row" data-categoryid="' + cat + '">' +
                '<td class="settings-category-name">' + DataMapping.getCategoryName(cat) + '</td>' +
                '<td class="settings-arrow"><img src="img/settings/arrow.png" /></td>' +
                '</tr>';

        $categorySection.append(html);
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
    $("#settings").on("tap", "#btn-search-magazines", SettingsController.filterSearch);
    $("#settings").on("tap", ".settings-letter", SettingsController.filterLetter);
    $("#settings").on("tap", ".settings-category", SettingsController.filterCategory);
    $("#settings").on("tap", ".settings-feed", SettingsController.filterFeed);
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