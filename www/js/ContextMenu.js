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
        ContextMenu.$menu.removeClass("context-menu-show");
    } else {
        ContextMenu.$menu.addClass("context-menu-show");
    }
};

ContextMenu.refreshAction = function() {
    alert('refresh');
    ContextMenu.endAction();
};

ContextMenu.favoriteAction = function() {
    alert('favorite');
    ContextMenu.endAction();
};

ContextMenu.preferencesAction = function() {
    Navigator.loadPage('preferences.html');
    ContextMenu.endAction();
};

ContextMenu.welcomeAction = function() {
    alert('welcome');
    ContextMenu.endAction();
};

ContextMenu.feedbackAction = function() {
    alert('feedback');
    ContextMenu.endAction();
};

ContextMenu.politicsAction = function() {
    alert('politics');
    ContextMenu.endAction();
};

ContextMenu.endAction = function(){
    ContextMenu.toggleMenu();
};
