var ContextMenu = function() {
};

ContextMenu.$menu = null;

ContextMenu.init = function() {
    App.$headerApp.on('tap', "#app-bar-context-menu", ContextMenu.toggleMenu);
    $("body").on('tap',ContextMenu.hide);
    
    ContextMenu.$menu = $("#context-menu");
    
    ContextMenu.$menu.on('tap', "#cm-refresh", ContextMenu.refreshAction);
    ContextMenu.$menu.on('tap', "#cm-favorite", ContextMenu.favoriteAction);
    ContextMenu.$menu.on('tap', "#cm-preferences", ContextMenu.preferencesAction);
    ContextMenu.$menu.on('tap', "#cm-welcome", ContextMenu.welcomeAction);
    ContextMenu.$menu.on('tap', "#cm-feedback", ContextMenu.feedbackAction);
    ContextMenu.$menu.on('tap', "#cm-politics", ContextMenu.politicsAction);
    
};

//toggleMenu
ContextMenu.toggleMenu = function(event) {
    if (ContextMenu.$menu.hasClass("context-menu-show")) {
        ContextMenu.hide();
    } else {
        ContextMenu.show();
    }
    
    event.stopPropagation();
};

ContextMenu.show = function() {
    $(".context-menu-show").removeClass("context-menu-show");
    ContextMenu.$menu.addClass("context-menu-show");
};

ContextMenu.hide = function(event) {
    $(".context-menu-show").removeClass("context-menu-show");
};

ContextMenu.refreshAction = function() {
    setTimeout(function(){   
        
        ContextMenu.hide();

        if(Navigator.currentPage === "home.html" || Navigator.currentPage === "articlesByCategory.html"){
            App.currentController.refresh();
        }
    
    }, 250);
};

ContextMenu.favoriteAction = function() {
    setTimeout(function(){   

        ContextMenu.hide();
        // Se tiver algo na busca, deve ser removido
        App.$appSearchInput.children("input").val("");
        App.$appSearchInput.children("input").blur();

        Navigator.loadPage('articlesByCategory.html');
    
    }, 250);
    
};

ContextMenu.preferencesAction = function() {
    setTimeout(function(){

        ContextMenu.hide();
        Navigator.loadPage('preferences.html');
    
    }, 250);
};

ContextMenu.welcomeAction = function() {
    setTimeout(function(){

        ContextMenu.hide();
        Introduction.show();
        
    }, 250);
};

ContextMenu.feedbackAction = function() {
    setTimeout(function(){

        ContextMenu.hide();
        
        var platform = device.platform;
        switch(platform.toLowerCase()) {
            case "android":
                window.open("market://details?id=org.scielo.pulsemob", "_system");
                break;
            case "ios":
                window.open('https://itunes.apple.com/app/angry-birds/id343200656', "_system","location=no");
                break;
        }     
        
    }, 250);
};

ContextMenu.politicsAction = function() {
    setTimeout(function(){        

        ContextMenu.hide();
        Navigator.loadPage("politics.html");
               
    }, 250);
};
