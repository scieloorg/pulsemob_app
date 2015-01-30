/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Service = function () {
};

Service.favoriteArticle = function (idArticle) {
    $.when(
            SciELO.favorite(idArticle)
            ).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log("Server request failed.");
                return false;
            }
    );
};

Service.unfavoriteArticle = function (idArticle) {
    $.when(
            SciELO.unfavorite(idArticle)
            ).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log("Server request failed.");
                return false;
            }
    );
};

Service.listFavoriteArticles = function () {
    $.when(
            Scielo.listFavorites()
            ).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log("Server request failed.");
                return false;
            }
    );
};

Service.getHomeArticles = function(){
    $.when(
            SciELO.home()
            ).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log("Server request failed.");
                return false;
            }
    );
};

Service.uncheckFeed = function (idFeed){
     $.when(
            Scielo.uncheckFeed(idFeed)
            ).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log("Server request failed.");
                return false;
            }
    );
};

Service.checkFeed = function (idFeed){
     $.when(
            Scielo.checkFeed(idFeed)
            ).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log("Server request failed.");
                return false;
            }
    );
};

Service.uncheckPublication = function (idPublication, idFeed){
    $.when(
            Scielo.uncheckPublication(idPublication, idFeed)
            ).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log("Server request failed.");
                return false;
            }
    );
};

Service.checkPublication = function (idPublication, idFeed){
    $.when(
            Scielo.checkPublication(idPublication, idFeed)
            ).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log("Server request failed.");
                return false;
            }
    );
};

Service.changeLanguage = function (language){
    $.when(
            Scielo.changeLanguage(language)
            ).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log("Server request failed.");
                return false;
            }
    );
};

Service.changeFontSize = function (fontSize){
    $.when(
            Scielo.changeFontSize(fontSize)
            ).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log("Server request failed.");
                return false;
            }
    );
};