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
    this.feeds = null;
};

User.prototype.updateFromLoginData = function (loginData) {
    this.feeds = loginData.feeds;
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

User.prototype.isFavoriteArticle = function (idArticle) {
    var index = this.favorites.indexOf(idArticle);
    if (index > -1) {
        return true;
    }else{
        return false;
    }
};

User.prototype.changeLanguage = function(language){
    this.language = language;
};

User.prototype.changeFontSize = function(fontSize){
    this.font_size = fontSize;
};

User.prototype.getFeeds = function(){
    return this.feeds;
};

User.prototype.getFeed = function(feedId){
    return this.feeds[feedId];
};

User.prototype.getFeedName = function(feedId){
    return this.feeds[feedId].feed_name;
};

User.prototype.getFeedMagazines = function(feedId){
    return this.feeds[feedId].magazines;
};

User.prototype.setFeed = function(feed){
    this.feeds[feed.feed_id] = {};
    this.feeds[feed.feed_id].feed_name = feed.feed_name;
    this.feeds[feed.feed_id].magazines = feed.magazines;
};

User.prototype.deleteFeed = function(feedId){
    delete this.feeds[feedId];
};