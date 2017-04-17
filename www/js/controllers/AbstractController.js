var AbstractController = function () {
};

AbstractController.articleData = null;


AbstractController.prototype = {
    initialize: function () {
        App.$page.addClass("abstract-bg");
        AbstractController.initListeners();
        AbstractController.populate();
        AbstractController.checkIfIsFavorite();
        App.showBackButton();

        App.trackView("Artigo");
        App.trackEvent('Artigo', 'Abrir', AbstractController.articleData.id);

    },
    destroy: function () {
        App.$page.removeClass("abstract-bg");
        App.hideBackButton();
        PageLoad.ajxHandle = null;
    }
};

AbstractController.initListeners = function () {
    $("#abstract-details").on('tap', "#add-fav-btn", AbstractController.favorite);
    $("#abstract-details").on('tap', "#share-btn", AbstractController.share);
    $("#abs-content").on('tap', ".abstract-web-btn", AbstractController.openWebArticle);
};

AbstractController.populate = function () {
    $(".abstract-header").css("background", "url(" + AbstractController.articleData.imgUrl + ") no-repeat center top #fff");

    $("#article-title").html(AbstractController.articleData.title);
    $("#article-author").html(Localization.getValue("by") + " " + AbstractController.articleData.author);

    var magazineName = DataMapping.getMagazineName(AbstractController.articleData.magazineId);

    $("#article-magazine").html(magazineName);
    $("#article-date").html(AbstractController.articleData.date);

    if (AbstractController.articleData.abstract) {
        $("#article-abstract").html(AbstractController.articleData.abstract);
    } else {
        $("#btn-article-web2").hide();
    }

    $("#article-abstract").html(AbstractController.articleData.abstract);

    AbstractController.resizeTextArea();
    if (AbstractController.articleData.keywords && AbstractController.articleData.keywords !== "undefined") {
        $("#article-tags").html(Localization.getValue("tags") + ": " + AbstractController.articleData.keywords);
    }
};

AbstractController.resizeTextArea = function () {
    var $textArea = document.getElementById('article-abstract');

    // we need box-sizing: border-box, if the textarea has padding
    $textArea.style.boxSizing = $textArea.style.mozBoxSizing = 'border-box';

    // we don't need any scrollbars, do we? :)
    $textArea.style.overflowY = 'hidden';

    // the minimum height initiated through the "rows" attribute
    var minHeight = $textArea.scrollHeight;

    // we adjust height to the initial content
    // compute the height difference which is caused by border and outline
    var outerHeight = parseInt(window.getComputedStyle($textArea).height, 10);
    var diff = outerHeight - $textArea.clientHeight;

    // set the height to 0 in case of it has to be shrinked
    $textArea.style.height = 0;

    // set the correct height
    // el.scrollHeight is the full height of the content, not just the visible part
    $textArea.style.height = Math.max(minHeight, $textArea.scrollHeight + diff) + 'px';
};

AbstractController.checkIfIsFavorite = function () {
    var allFavorites = App.currentUser.getAllFavorites();
    if (allFavorites.indexOf(AbstractController.articleData.id) >= 0) {
        $("#add-fav-btn").children("img").attr("src", "img/abstract/fav_selected.png");
    }
};

AbstractController.favorite = function () {
    App.showLoadingScreen();
    var allFavorites = App.currentUser.getAllFavorites();
    var $obj = $(this).children("img");

    if (allFavorites.indexOf(AbstractController.articleData.id) < 0) {
        $.when(
                Service.favoriteArticle(AbstractController.articleData.id)
                ).then(
                function () {
                    $obj.attr("src", "img/abstract/fav_selected.png");
                    $(ArticleUtils.selectedArticle).children(".article-legend").append( "<img class=\"article-fav\" src=\"img/abstract/fav_selected.png\"/>" );
                    App.hideLoadingScreen();
                },
                function (err) {
                    App.hideLoadingScreen();
                    App.showCommonInternetErrorDialog();
                    return;
                }
        );
    } else {
        $.when(
                Service.unfavoriteArticle(AbstractController.articleData.id)
                ).then(
                function () {
                    $obj.attr("src", "img/abstract/fav.png");
                    $(ArticleUtils.selectedArticle).children(".article-legend").children(".article-fav").remove();
                    App.hideLoadingScreen();
                },
                function (err) {
                    App.hideLoadingScreen();
                    App.showCommonInternetErrorDialog();
                    return;
                }
        );
    }
};

AbstractController.share = function () {
    var domain = AbstractController.articleData.domain;
    var pid = AbstractController.articleData.id.substring(0, AbstractController.articleData.id.length - 3);

    window.plugins.socialsharing.share(AbstractController.articleData.title + " -", "SciELO Mobile", null, "http://" + domain + "/scielo.php?script=sci_arttext&pid=" + pid + "&lng=" + App.locale + "&nrm=iso");

    App.trackEvent('Artigo', 'Compartilhar', AbstractController.articleData.id);

};

AbstractController.openWebArticle = function () {
    var domain = AbstractController.articleData.domain;
    var pid = AbstractController.articleData.id.substring(0, AbstractController.articleData.id.length - 3);

    App.openLink("http://" + domain + "/scielo.php?script=sci_arttext&pid=" + pid + "&lng=" + App.locale + "&nrm=iso");
    App.trackEvent('Artigo', 'Abrir na Web', AbstractController.articleData.id);
};