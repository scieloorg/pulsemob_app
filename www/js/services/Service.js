/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Service = function () {
};

Service.login = function (userData) {
    var deferred = $.Deferred();
    $.when(
        SciELO.loginUser(userData)
    ).then(
        function (response) {
            // Init user
            var user = new User();
            user.updateFromLoginData(response);
            App.currentUser = user;
            App.setLocale(user.language);
            App.setFontSize(user.font_size);
            DataMapping.checkVersion(response.solr_version);


            var analyticsUserId = "";
            if(user.email){
                analyticsUserId = user.email;
            }else if(user.facebook_id){
                analyticsUserId = "fb-"+user.facebook_id;
            }else{
                analyticsUserId = "gp-"+user.google_id;
            }

            try{
                analytics.setUserId(analyticsUserId);
            }catch(err){
                if(!App.DEBUG_BROWSER) console.log(err);
            }


            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error on login: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};

Service.favoriteArticle = function (idArticle) {
    var deferred = $.Deferred();
    $.when(
        SciELO.favorite(idArticle)
    ).then(
        function (response) {
            App.currentUser.favoriteArticle(idArticle);
            App.trackEvent('Artigo', 'Favoritar', idArticle);

            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error favorite article: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};

Service.unfavoriteArticle = function (idArticle) {
    var deferred = $.Deferred();
    $.when(
        SciELO.unfavorite(idArticle)
    ).then(
        function (response) {
            App.currentUser.unfavoriteArticle(idArticle);


            App.trackEvent('Artigo', 'Desfavoritar', AbstractController.articleData.id);


            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error unfavorite article: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};

Service.listCollections = function () {
    var deferred = $.Deferred();
    $.when(
        SciELO.listCollections()
    ).then(
        function (response) {
            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error list collections: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};

Service.listFavoriteArticles = function () {
    var deferred = $.Deferred();
    $.when(
        SciELO.listFavorites()
    ).then(
        function (response) {
            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error list favorites articles: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};

Service.getHomeArticles = function () {
    var deferred = $.Deferred();
    $.when(
        SciELO.home()
    ).then(
        function (response) {
            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error list home articles: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};

Service.changeLanguage = function (language) {
    var deferred = $.Deferred();
    $.when(
        SciELO.changeLanguage(language)
    ).then(
        function (response) {
            App.currentUser.changeLanguage(language);
            App.trackEvent('Preferencias', 'Idioma', language);

            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error change language: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};

Service.changeFontSize = function (fontSize) {
    var deferred = $.Deferred();
    $.when(
        SciELO.changeFontSize(fontSize)
    ).then(
        function (response) {
            App.currentUser.changeFontSize(fontSize);
            App.trackEvent('Preferencias', 'Fonte', fontSize);

            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error change font size: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};

Service.createFeed = function (feedName, magazines) {
    var deferred = $.Deferred();
    $.when(
        SciELO.createFeed(feedName, magazines)
    ).then(
        function (response) {
            App.currentUser.setFeed(response);
            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error on createFeed: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};

Service.saveFeed = function (feedId, magazinesToAdd, magazinesToRemove) {
    
    var deferred = $.Deferred();
    $.when(
        SciELO.saveFeed(feedId, magazinesToAdd, magazinesToRemove)
    ).then(
        function (response) {
            App.currentUser.setFeed(response);
            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error on saveFeed: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};

Service.deleteFeed = function (feedId) {
    var deferred = $.Deferred();
    $.when(
        SciELO.deleteFeed(feedId)
    ).then(
        function (response) {
            App.currentUser.deleteFeed(feedId);
            deferred.resolve(response);
        },
        function (err) {
            App.trackException("Error on createFeed: "+JSON.stringify(err));
            deferred.reject(err);
        }
    );
    return deferred.promise();
};