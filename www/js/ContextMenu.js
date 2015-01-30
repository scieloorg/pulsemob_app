var ContextMenu = function() {
};

ContextMenu.$menu = null;
ContextMenu.showFavorites = false;

ContextMenu.init = function() {
    App.$headerApp.on('tap', "#app-bar-context-menu", ContextMenu.toggleMenu);
    App.$page.on('tap', '#block-content-glass', ContextMenu.hide);
    
    ContextMenu.$menu = $("#context-menu");
    
    ContextMenu.$menu.on('tap', "#cm-refresh", ContextMenu.refreshAction);
    ContextMenu.$menu.on('tap', "#cm-favorite", ContextMenu.favoriteAction);
    ContextMenu.$menu.on('tap', "#cm-preferences", ContextMenu.preferencesAction);
    ContextMenu.$menu.on('tap', "#cm-welcome", ContextMenu.welcomeAction);
    ContextMenu.$menu.on('tap', "#cm-feedback", ContextMenu.feedbackAction);
    ContextMenu.$menu.on('tap', "#cm-politics", ContextMenu.politicsAction);
};

//toggleMenu
ContextMenu.toggleMenu = function() {
    if (ContextMenu.$menu.hasClass("context-menu-show")) {
        ContextMenu.hide();
    } else {
        ContextMenu.show();
    }
};

ContextMenu.show = function() {
    $(".context-menu-show").removeClass("context-menu-show");
    Transition.hideMenu();
    $("#block-content-glass").show();
    ContextMenu.$menu.addClass("context-menu-show");
};

ContextMenu.hide = function() {
    ContextMenu.$menu.removeClass("context-menu-show");
    // timeout para o evento do 'tap' no menu nao passar para pagina de baixo
    setTimeout(function(){ $("#block-content-glass").hide(); },300);
};

ContextMenu.refreshAction = function() {
    ContextMenu.hide();
    
    if(Navigator.currentPage === "home.html" ){
        App.currentController.refresh();
    }
};

ContextMenu.favoriteAction = function() {
    ContextMenu.hide();
    // Se tiver algo na busca, deve ser removido
    App.$appSearchInput.children("input").val("");
    App.$appSearchInput.children("input").blur();
    
    ContextMenu.showFavorites = true;
    
    Navigator.loadPage('home.html');
};

ContextMenu.preferencesAction = function() {
    ContextMenu.hide();
    Navigator.loadPage('preferences.html');
};

ContextMenu.welcomeAction = function() {
    ContextMenu.hide();
    Introduction.show();
};

ContextMenu.feedbackAction = function() {
    ContextMenu.hide();
    App.openLink("http://www.scielo.org/php/contact.php?lang="+App.locale);
};

ContextMenu.politicsAction = function() {
    ContextMenu.hide();
    Navigator.loadPage("politics.html");
};
