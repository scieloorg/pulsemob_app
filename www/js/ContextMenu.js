var ContextMenu = function() {
};

ContextMenu.$menu = null;

ContextMenu.init = function() {
    App.$headerApp.on('tap', "#app-bar-context-menu", ContextMenu.toggleMenu);
    
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
        $(".context-menu-show").removeClass("context-menu-show");
        Transition.hideMenu();
        ContextMenu.$menu.addClass("context-menu-show");
    }
};

ContextMenu.hide = function() {
    ContextMenu.$menu.removeClass("context-menu-show");
};

ContextMenu.refreshAction = function() {
    ContextMenu.hide();
    alert('refresh');
};

ContextMenu.favoriteAction = function() {
    ContextMenu.hide();
    alert('favorite');
    
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
