(function(window) {

    // page load object
    var PageLoad = window.PageLoad = {
        ajxHandle: null
    };

    //load ajax 
    PageLoad.load = function(page) {
        PageLoad.ajxHandle = $.ajax({
            url: "pages/" + page,
            async: false,
            success: PageLoad.success
        });
    };
    //sucess load
    PageLoad.success = function(content) {
        // add content in #page
        App.$contentLoad.html(content);

        if (App.currentController !== null) {
            // unset everything in the previous controller
            // prevent memory leaks
            App.currentController.destroy();
        }


        // create new controller
        switch (Navigator.currentPage) {
            case 'login.html':
                App.currentController = new LoginController();
                break;
            case 'home.html':
                App.currentController = new HomeController();
                break;
            case 'abstract.html':
                App.currentController = new AbstractController();
                break;
            case 'preferences.html':
                App.currentController = new PreferencesController();
                break;
            case 'categoryConfig.html':
                App.currentController = new CategoryConfigController();
                break;
            case 'politics.html':
                App.currentController = new PoliticsController();
                break;
            default:
                alert('No controller found.');
                break;
        }

        PageLoad.loadLocalizationPage(App.currentController, Navigator.currentPage);

        // once new controller created, initialize it
        if (App.currentController !== null) {
            App.currentController.initialize();
        }

        App.$content.removeClass(Transition.class);
    };
    
    PageLoad.loadLocalizationPage = function(controller, pageName) {
        var stringFile = null;

        if (controller.getLocalizationFile) {
            stringFile = controller.getLocalizationFile();
        } else {
            stringFile = pageName.replace("html", "json");
        }

        Localization.loadLocaleFile(stringFile);
    };


})(window);