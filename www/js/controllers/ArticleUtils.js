var ArticleUtils = function() {
};

ArticleUtils.selectedArticle;
ArticleUtils.articleOpen = false;

ArticleUtils.updateContent = function (el, data) {
    if (typeof data !== 'undefined'){
        
        var abstract;
        var languages = ["pt", "es", "en","fr"];
        
        // varifica o abstract na lingua original se não tiver verifica para outras línguas
        if(data["translated_abstracts_"+App.locale]){
            abstract = data["translated_abstracts_"+App.locale];
        }else if(data.original_abstract){
            abstract = data.original_abstract;
        }else{
            for (i = 0; i < languages.length; i++) { 
                if(data["translated_abstracts_"+languages[i]]){
                    abstract = data["translated_abstracts_"+languages[i]];                    
                    break;
                }
            }            
        }
        
        if(abstract === undefined){ abstract = ''; }
        
        var title = (data["translated_titles_"+App.locale]) ? data["translated_titles_"+App.locale] : data.original_title;
        
        var keywords = (data["keywords_"+App.locale]) ? data["keywords_"+App.locale].join(", ") : "";
        
        var domain = DataMapping.getMagazineDomain(data.journal_id);
        var magazineAcronym = DataMapping.getMagazineAcronym(data.journal_id);
        var magazineAbbreviated = DataMapping.getMagazineAbbreviation(data.journal_id);
        
        var imagePath = (data["image_upload_path"]) ? SciELO.imageBaseURL+data["image_upload_path"] : "http://"+domain+"/img/revistas/"+magazineAcronym+"/glogo.gif";
        
        var html = '<div class="article-link" data-domain="'+domain+'" data-articleid="'+data.id+'" data-abstract="'+btoa(unescape(encodeURIComponent(abstract)))+'" data-author="'+btoa(unescape(encodeURIComponent(data.first_author)))+'" data-keywords="'+btoa(unescape(encodeURIComponent(keywords)))+'" data-magazineid="'+btoa(unescape(encodeURIComponent(data.journal_id)))+'">'+
                        '<div class="article-principal">' +
                            '<img src="'+imagePath+'" />' +
                            '<div class="article-name">' +
                                title +
                            '</div>' +
                        '</div>' +
                        '<div class="article-legend">' +
                            '<div class="article-magazine"> '+magazineAbbreviated+' </div>' +
                            '<div class="article-date"> '+
                                data.publication_date_str +
                            '</div>';
                        
                            if(App.currentUser.isFavoriteArticle(data.id)) html += '<img class="article-fav" src="img/abstract/fav_selected.png"/>';
                                
            html +=     '</div>' +
                    '</div>';
        
        
        el.innerHTML = html;
    }else{
        App.trackException("Error on updateContent. data="+JSON.stringify(data));
    }
};


ArticleUtils.openArticle = function () {
    
    if($(".context-menu-show").length){
        return;
    }
    
    ArticleUtils.selectedArticle = this;
    
    var articleData = {};
    articleData.domain = $(this).data("domain");
    articleData.id = $(this).data("articleid");
    articleData.abstract = decodeURIComponent(escape(atob($(this).data("abstract"))));
    articleData.author = decodeURIComponent(escape(atob($(this).data("author"))));
    articleData.title = $(this).children("div.article-principal").children("div.article-name").html();
    articleData.imgUrl = $(this).children("div.article-principal").children("img").attr("src");
    articleData.date = $(this).children("div.article-legend").children("div.article-date").html();
    articleData.magazineId = decodeURIComponent(escape(atob($(this).data("magazineid"))));;
    articleData.keywords = decodeURIComponent(escape(atob($(this).data("keywords"))));
    
    AbstractController.articleData = articleData;
    //Navigator.loadPage("abstract.html");    
  
    $.get('pages/abstract.html', function(data) {
        App.$articleWrapper.html(data);
    });    
   
    setTimeout(function () {
        App.$contentWrapper.hide();
        
        App.$articleWrapper.show();        
        
        Localization.dictionnary = Localization.getDictionnary("abstract.json",App.locale);
        Localization.applyToCurrentHtml();
        
        App.$page.addClass("abstract-bg");
        AbstractController.initListeners();
        AbstractController.populate();
        AbstractController.checkIfIsFavorite();
        App.showBackButton();

        App.trackView("Artigo");
        App.trackEvent('Artigo', 'Abrir', AbstractController.articleData.id);
        new IScroll('#page-wrapper-article');
        App.$headerApp.off('tap', "#app-bar-back");
        App.$headerApp.on('tap', "#app-bar-back", ArticleUtils.backEvent);
        
        ArticleUtils.articleOpen = true;
        
    }, 500);
    
    ArticleUtils.backEvent = function(){
        setTimeout(function () {
            ArticleUtils.closeArticle();
        }, 500);        
    };    
    
};

ArticleUtils.closeArticle = function(){
    
    App.$page.removeClass("abstract-bg");
    App.hideBackButton();
    PageLoad.ajxHandle = null;
    App.$headerApp.off('tap', "#app-bar-back");
    App.$headerApp.on('tap', "#app-bar-back", Navigator.backEvent);
    App.$articleWrapper.hide();
    App.$contentWrapper.show();     
    
    ArticleUtils.articleOpen = false;
    
};
