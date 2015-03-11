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
                FeedsAndPublications.checkVersion(response.solr_version);
                App.initCategoryMenu();
                
                
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
                    console.log(err);
                }
                
                
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
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
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
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
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
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
                deferred.reject("Server request failed.");
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
                deferred.reject("Server request failed.");
            }
    );
    return deferred.promise();
};

Service.uncheckFeed = function (idFeed) {
    var deferred = $.Deferred();
    $.when(
            SciELO.uncheckFeed(idFeed)
            ).then(
            function (response) {
                App.currentUser.uncheckFeed(idFeed);
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
            }
    );
    return deferred.promise();
};

Service.checkFeed = function (idFeed) {
    var deferred = $.Deferred();
    $.when(
            SciELO.checkFeed(idFeed)
            ).then(
            function (response) {
                App.currentUser.checkFeed(idFeed);
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
            }
    );
    return deferred.promise();
};

Service.uncheckPublication = function (idFeed, idPublication) {
    var deferred = $.Deferred();
    $.when(
            SciELO.uncheckPublication(idFeed, idPublication)
            ).then(
            function (response) {
                App.currentUser.uncheckPublication(idFeed, idPublication);
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
            }
    );
    return deferred.promise();
};

Service.uncheckAllPublications = function (idFeed) {
    var deferred = $.Deferred();
    $.when(
            SciELO.uncheckAllPublications(idFeed)
            ).then(
            function (response) {
                App.currentUser.uncheckAllPublications(idFeed);
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
            }
    );
    return deferred.promise();
};

Service.checkPublication = function (idFeed, idPublication) {
    var deferred = $.Deferred();
    $.when(
            SciELO.checkPublication(idFeed, idPublication)
            ).then(
            function (response) {
                App.currentUser.checkPublication(idFeed, idPublication);
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
            }
    );
    return deferred.promise();
};

Service.checkAllPublications = function (idFeed) {
    var deferred = $.Deferred();
    $.when(
            SciELO.checkAllPublications(idFeed)
            ).then(
            function (response) {
                App.currentUser.checkAllPublications(idFeed);
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
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
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
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
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
            }
    );
    return deferred.promise();
};