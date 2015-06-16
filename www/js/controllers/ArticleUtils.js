var ArticleUtils = function() {
};


ArticleUtils.updateContent = function (el, data) {
    if (typeof data !== 'undefined'){
        
        var abstract = (data["translated_abstracts_"+App.locale]) ? data["translated_abstracts_"+App.locale] : data.original_abstract;
        
        var title = (data["translated_titles_"+App.locale]) ? data["translated_titles_"+App.locale] : data.original_title;
        
        var keywords = (data["keywords_"+App.locale]) ? data["keywords_"+App.locale].join(", ") : "";
        
        var html = '<div class="article-link" data-articleid="'+data.id+'" data-abstract="'+btoa(unescape(encodeURIComponent(abstract)))+'" data-author="'+btoa(unescape(encodeURIComponent(data.first_author)))+'" data-keywords="'+btoa(unescape(encodeURIComponent(keywords)))+'" data-journal="'+btoa(unescape(encodeURIComponent(data.journal_title)))+'">'+
                        '<div class="article-principal">' +
                            '<img src="http://'+data.scielo_domain+'/img/revistas/'+data.journal_acronym+'/glogo.gif" />' +
                            '<div class="article-name">' +
                                title +
                            '</div>' +
                        '</div>' +
                        '<div class="article-legend">' +
                            '<div class="article-journal"> '+data.journal_abbreviated_title+' </div>' +
                            '<div class="article-date"> '+
                                data.publication_date.formatToDateSciELO() +
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
    var articleData = {};
    articleData.id = $(this).data("articleid");
    articleData.abstract = decodeURIComponent(escape(atob($(this).data("abstract"))));
    articleData.author = decodeURIComponent(escape(atob($(this).data("author"))));
    articleData.title = $(this).children("div.article-principal").children("div.article-name").html();
    articleData.imgUrl = $(this).children("div.article-principal").children("img").attr("src");
    articleData.date = $(this).children("div.article-legend").children("div.article-date").html();
    articleData.journal = decodeURIComponent(escape(atob($(this).data("journal"))));;
    articleData.keywords = decodeURIComponent(escape(atob($(this).data("keywords"))));
    
    var catId = $(this).parent("li").parent("ul").data("magazine");
    articleData.category = $("#magazine-title-"+catId).html();
    
    
    AbstractController.articleData = articleData;
    
    //console.log(JSON.stringify(articleData));
    
    Navigator.loadPage("abstract.html");
};