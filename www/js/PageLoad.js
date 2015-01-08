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
            case 'home.html':
                App.currentController = new HomeController();
                break;
            default:
                alert('No controller found.');
                break;
        }

        // once new controller created, initialize it
        if (App.currentController !== null) {
            App.currentController.initialize();
        }

        App.$content.removeClass(Transition.class);
    };


})(window);