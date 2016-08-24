var Introduction = function() {
};

Introduction.hasStarted = false;

Introduction.show = function(){
    $("#intro-container").fadeIn(300, function(){
        if(!Introduction.hasStarted){
            Introduction.start();
        }
    });
};

Introduction.start = function(){
    $("#intro-container").on('tap', "#close-btn", Introduction.closeIntro);
    
    var height = App.$contentWrapper.height() * 0.9;
    $("#intro-wrapper").css("height",height+"px");
    $("#intro-wrapper").css("height",height+"px");
    
    Introduction.setCarousel();
    Introduction.carouselNormalization();
    
    new IScroll('#intro-wrapper', {scrollbars: true, click: false});
    
    Introduction.hasStarted = true;
};

Introduction.setCarousel = function() {
    $("#info-carousel").carousel({interval: false, wrap: false});
    $("#info-carousel").swiperight(function() {
            $(this).carousel('prev');
    });
    $("#info-carousel").swipeleft(function() {
            $(this).carousel('next');
    });
};

Introduction.carouselNormalization = function() {
    var items = $('#info-carousel .item'), //grab all slides
                    heights = [], //create empty array to store height values
                    tallest; //create variable to make note of the tallest slide
    if (items.length) {
            function normalizeHeights() {
                    items.each(function() { //add heights to array
                            heights.push($(this).height());
                    });

                    tallest = Math.max.apply(null, heights); //cache largest value
                    items.each(function() {
                            $(this).css('min-height', tallest + 'px');
                    });
            }
            ;
            normalizeHeights();
            $(window).on('resize orientationchange', function() {
                    tallest = 0, heights.length = 0; //reset vars
                    items.each(function() {
                            $(this).css('min-height', '0'); //reset min-height
                    });
                    normalizeHeights(); //run it again 
            });
    }
};

Introduction.closeIntro = function () {
    $("#intro-container").fadeOut(500);
};
