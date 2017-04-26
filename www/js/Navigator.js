(function(window) {
    //navigator object
    var Navigator = window.Navigator = {
        control: true,
        currentPage: '',
        currentPageScreenData: null,
        currentModal:null,
        fullpage: true
        
    };
    //load page
    Navigator.backEvent = function(){
        
        if(ContextMenu.$menu.hasClass("context-menu-show")){
            ContextMenu.hide();
            return;
        }
        
        if(Navigator.currentModal !== null){
            Navigator.currentModal.close();
            Navigator.currentModal = null;
            return;
        }
        
        var state = App.history.pop();
        if(state){
            if(state.page){
                Navigator.currentPage = state.page;
                Navigator.currentPageScreenData = state.screenData;
                Transition.control = true;
                Transition.class = Transition.getClassAnimation(Navigator.currentPage);
                Transition.start();
                App.hideLoadingScreen();
            }
        }else if(ArticleUtils.articleOpen){
            ArticleUtils.closeArticle();
        }else{ // sai do app
            Navigator.currentModal = new BootstrapDialog({
                message: Localization.getAppValue("exit-ask"),
                buttons: [{
                        label: Localization.getAppValue("yes"),
                        action: function(dialog) {
                            dialog.close();
                            navigator.app.exitApp();
                        }
                    },{
                        label: Localization.getAppValue("no"),
                        action: function(dialog) {
                            dialog.close();
                        }
                    }]
            });
            Navigator.currentModal.realize();
            Navigator.currentModal.open();
        }
    };
    
    Navigator.loadPage = function(url) {
        var newPage = null;

        if(typeof url === "string") {
            newPage = url;
        }
        else {
             newPage = $(this).data("url");
        }
        
        if(Navigator.currentPage === newPage && Navigator.currentPage !== "articlesByCategory.html") {
            return;
        }
        
        if(!Navigator.fullpage){
            if(App.currentController && App.currentController.getScreenData){
                var data = App.currentController.getScreenData();
                App.history.push({ page: Navigator.currentPage, screenData: data });
            }else{
                App.history.push({ page: Navigator.currentPage, screenData: null  });
            }
        }else{
            App.showNormalPage();
            Navigator.fullpage = false;
        }
        
        Navigator.load(newPage).done(function () {
            console.log('Request completed');
            setTimeout(function () {
                ArticleUtils.closeArticle();
            }, 10);    
        });
;
    };
    
    
    Navigator.loadFullPage = function(url) {
        Navigator.fullpage = true;
        App.showFullPage();
        
        Navigator.load(url);
    };
    
    Navigator.load = function(url){
        ContextMenu.hide();
        App.$appSearchInput.children("input").val("");
        App.$appSearchInput.children("input").blur();
        Transition.control = true;
        Navigator.currentPage = url;
        Navigator.currentPageScreenData = null;
        
        
        Transition.class = Transition.getClassAnimation(Navigator.currentPage);
        return Transition.start();
    };


})(window);