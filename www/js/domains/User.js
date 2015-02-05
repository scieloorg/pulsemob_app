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
    this.favorites = [];
    this.feed_exclusions = {};
    this.publication_feed_exclusions = [];
};

User.prototype.updateFromLoginData = function (loginData) {
    this.feed_exclusions = loginData.feed_exclusions;
    this.publication_feed_exclusions = loginData.publication_feed_exclusions;
    this.favorites = loginData.favorites;
    this.name = loginData.user.name;
    this.language = loginData.user.language;
    this.update_time = loginData.user.update_time;
    this.create_time = loginData.user.create_time;
    this.font_size = loginData.user.font_size;
    this.google_id = loginData.user.google_id;
    this.facebook_id = loginData.user.facebook_id;
    this.id = loginData.user.id;
    this.email = loginData.user.email;
};

User.prototype.getAllFavorites = function () {
    return this.favorites;
};

User.prototype.favoriteArticle = function (idArticle) {
    if (this.favorites.indexOf(idArticle) === -1) {
        this.favorites.push(idArticle);
    }
};

User.prototype.unfavoriteArticle = function (idArticle) {
    var index = this.favorites.indexOf(idArticle);
    if (index > -1) {
        this.favorites.splice(index, 1);
    }
};

User.prototype.getAllFeedsExclusions = function () {
    return this.feed_exclusions;
};

User.prototype.uncheckFeed = function (feedId) {
    var index = this.feed_exclusions.indexOf(feedId);
    if (index === -1) {
        this.feed_exclusions.push(feedId);
    }
};

User.prototype.checkFeed = function (feedId) {
    var index = this.feed_exclusions.indexOf(feedId);
    if (index > -1) {
        this.feed_exclusions.splice(index, 1);
    }
};

User.prototype.getAllPublicationsExclusionsByFeed = function (feedId) {
    if(feedId in this.publication_feed_exclusions){
        return this.publication_feed_exclusions[feedId];
    }else{
        return [];
    }
};

User.prototype.uncheckPublication = function (feedId, publicationId) {
    if (feedId in this.publication_feed_exclusions) {
        var index = this.publication_feed_exclusions[feedId].indexOf(publicationId);
        if (index === -1) {
            this.publication_feed_exclusions[feedId].push(publicationId);
        }
    }else{
        this.publication_feed_exclusions[feedId] = [];
        this.publication_feed_exclusions[feedId].push(publicationId);
    }
};

User.prototype.checkPublication = function (feedId, publicationId) {
    if (feedId in this.publication_feed_exclusions) {
        var index = this.publication_feed_exclusions[feedId].indexOf(publicationId);
        if (index > -1) {
            this.publication_feed_exclusions[feedId].splice(index, 1);
        }
    }
};

User.prototype.changeLanguage = function(language){
    this.language = language;
};

User.prototype.changeFontSize = function(fontSize){
    this.font_size = fontSize;
};