/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var User = function () {
    this.id = null;
    this.create_time = null;
    this.update_time = null;
    this.email = null;
    this.name = null;
    this.facebook_id = null;
    this.google_id = null;
    this.language = null;
    this.font_size = null;
    this.token = null;
    this.favorites = [];
    this.feed_exclusions = {};
    this.publication_feed_exclusions = [];
};

//{
//    "publication_feed_exclusions": [],
//    "solr_version": 63511,
//    "feed_exclusions": [],
//    
//    "user": {
//        "language": "EN",
//        "update_time": "2015-02-02 21:14:15.261000+00:00",
//        "create_time": "2015-01-30 20:46:44.443000+00:00",
//        "font_size": "M",
//        "name": "Carlos Eduardo Correa Braga",
//        "google_id": "101226822208699460825",
//        "facebook_id": "1058694040823178",
//        "id": 3,
//        "email": "caducbraga@gmail.com"
//    }
//}

//var myStringArray = ["Hello","World"];
//var arrayLength = myStringArray.length;
//for (var i = 0; i < arrayLength; i++) {
//    alert(myStringArray[i]);
//    //Do something
//}

User.prototype.updateFromLoginData = function (loginData) {
//    this.feed_exclusions = [];
    this.feed_exclusions = loginData.feed_exclusions;
//    for (var i = 0; i < feedExclusions.length; i++){
//        this.feed_exclusions.push(feedExclusions[i]);
//    }

    this.publication_feed_exclusions = loginData.publication_feed_exclusions;
//    var publicationFeedExclusions = loginData.publication_feed_exclusions;
//    for (var key in publicationFeedExclusions){
//        if(this.publication_feed_exclusions[key] === undefined){
//            this.publication_feed_exclusions[key] = [];
//        }
//        this.publication_feed_exclusions[key].push(publicationFeedExclusions[key]);
//    }

    this.favorites = loginData.favorites;
};

User.prototype.favoriteArticle = function (idArticle) {
    if (this.favorites.indexOf(idArticle) === -1) {
        this.favorites.push(idArticle);
    }
};

User.prototype.unfavoriteArticle = function (idArticle) {
    var index = this.favorites.indexOf(idArticle);
    if (index > -1) {
        this.favorites.slice(index, 1);
    }
};

User.prototype.uncheckFeed = function (feedId) {
    var index = this.feed_exclusions.indexOf(feedId);
    if (index === -1) {
        this.feed_exclusions.push(idArticle);
    }
};

User.prototype.checkFeed = function (feedId) {
    var index = this.feed_exclusions.indexOf(feedId);
    if (index > -1) {
        this.feed_exclusions.slice(index, 1);
    }
};

User.prototype.uncheckPublication = function (feedId, publicationId) {
    if (feedId in this.publication_feed_exclusions) {
        if (this.publication_feed_exclusions[feedId].length === 1) {
            this.publication_feed_exclusions[feedId] = undefined;
        } else {
            var index = this.publication_feed_exclusions[feedId].indexOf(publicationId);
            if (index > -1) {
                this.publication_feed_exclusions.slice(index, 1);
            }
        }
    }
};

User.prototype.checkPublication = function (feedId, publicationId) {
    if (!feedId in this.publication_feed_exclusions) {
        this.publication_feed_exclusions[feedId] = [];
        this.publication_feed_exclusions[feedId].push(publicationId);
    } else {
        var index = this.publication_feed_exclusions[feedId].indexOf(publicationId);
        if (index === -1) {
            this.publication_feed_exclusions.push(publicationId);
        }
    }
};

User.prototype.changeLanguage = function(language){
    this.language = language;
};

User.prototype.changeFontSize = function(fontSize){
    this.font_size = fontSize;
};