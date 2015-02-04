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
            Scielo.listFavorites()
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
            Scielo.uncheckFeed(idFeed)
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
            Scielo.checkFeed(idFeed)
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

Service.uncheckPublication = function (idPublication, idFeed) {
    var deferred = $.Deferred();
    $.when(
            Scielo.uncheckPublication(idPublication, idFeed)
            ).then(
            function (response) {
                App.currentUser.uncheckPublication(idPublication, idFeed);
                deferred.resolve(response);
            },
            function (err) {
                deferred.reject("Server request failed.");
            }
    );
    return deferred.promise();
};

Service.checkPublication = function (idPublication, idFeed) {
    var deferred = $.Deferred();
    $.when(
            Scielo.checkPublication(idPublication, idFeed)
            ).then(
            function (response) {
                App.currentUser.checkPublication(idPublication, idFeed);
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
            Scielo.changeLanguage(language)
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
            Scielo.changeFontSize(fontSize)
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