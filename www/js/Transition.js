(function(window) {

    // transition object
    var Transition = window.Transition = {
        control: false,
        class: 'transitionApp2',
        deferred: null
    };

    /* effects, for select one effect, create or view effects in transitions.css */
    Transition.animations = {
        'home.html': 'transitionApp2'
    }
    //get current class for page
    Transition.getClassAnimation = function(page) {
        if (Transition.animations.hasOwnProperty(page)) {
            return Transition.animations[page];
        }
        return Transition.class;
    }

    //start transition
    Transition.start = function() {
        Transition.deferred = $.Deferred();
        App.$content.addClass(Transition.class);

        return Transition.deferred.promise();
    };
    //end transition with listener
    Transition.End = function() {
        if (Transition.control) {
            Transition.control = false;
            PageLoad.load(Navigator.currentPage);
            
            App.refreshScroll();
            Transition.deferred.resolve(true);
        }
    };
    
    Transition.swipeleftMenu = function() {
        if (App.$menu.hasClass("transitionMenuAppStart") && !Navigator.fullpage) {
            Transition.hideMenu();
        }
    }
    
    Transition.swiperightMenu = function() {
        if (!App.$menu.hasClass("transitionMenuAppStart") && !Navigator.fullpage) {
            if(Navigator.currentPage === "newAnalysis.html") return;
            Transition.showMenu();
        }
    }
    
    //toggleMenu
    Transition.toggleMenu = function() {
        if (App.$menu.hasClass("transitionMenuAppStart")) {
            Transition.hideMenu();
        } else {
            Transition.showMenu();
        }
    };
    //hide panel menu
    Transition.hideMenu = function() {
        App.$menu.removeClass("transitionMenuAppStart");
        //App.$content.removeClass("transitionContentAppStart");
        App.$blockDiv.addClass("hidden");
    };
    
    //show panel menu
    Transition.showMenu = function() {
        App.scrollMenu.scrollTo(0,0);
        App.$menu.addClass("transitionMenuAppStart");
        //App.$content.addClass("transitionContentAppStart");
        App.$blockDiv.removeClass("hidden");
    };
    
    Transition.addEventListeners = function() {
        App.$content.on("webkitTransitionEnd transitionend MSTransitionEnd", Transition.End);
    };

})(window);