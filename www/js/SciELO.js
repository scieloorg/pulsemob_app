var SciELO = function(){};

SciELO.sessionCache = new Array();

//SciELO.serverURL = "http://192.168.0.27:8000/";
SciELO.solrURL = "http://webservices.pulsemob.scielo.org/";
SciELO.imageBaseURL = "http://webservices.pulsemob.scielo.org/";
SciELO.serverURL = "http://webservices.pulsemob.scielo.org/webservices/mobile/";
//SciELO.serverURL = "http://192.168.0.27:8000/";


SciELO.loginUser = function(userInfo){
    return SciELO.callWebServiceFunctionPOST("login",userInfo);
};

SciELO.searchMagazines = function(searchQuery){
    return SciELO.callWebServiceFunctionPOST("magazine/search", {q: searchQuery});
};

SciELO.createFeed = function(feedName, magazines){
    return SciELO.callWebServiceFunctionPOST("feed/create",{feed_name:feedName, magazines:magazines});
};

SciELO.saveFeed = function(feedId, magazinesToAdd, magazinesToRemove){
    return SciELO.callWebServiceFunctionPOST("feed/update",{feed_id:feedId, add:magazinesToAdd, remove:magazinesToRemove});
};

SciELO.deleteFeed = function(feedId){
    return SciELO.callWebServiceFunctionPOST("feed/delete",{feed_id: feedId});
};

SciELO.search = function(params){
    //chamada solr n tem /webservices
    return SciELO.callSOLRFunction("search", params);
};

SciELO.magazine = function(params){
    //chamada solr n tem /webservices
    return SciELO.callSOLRFunction("magazine", params);
};

SciELO.home = function(){
    return SciELO.cachedCall("home", {}, true, 60 * 60); // uma hora para expirar
};

SciELO.homeCleanCache = function(){
    SciELO.removeCache("home", true);
};

SciELO.dataMapping = function(){
    return SciELO.callWebServiceFunction("category/magazines/list", {});
};

SciELO.favorite = function(idArticle){
    return SciELO.callWebServiceFunctionPOST("favorite/create", {article_id: idArticle});
};

SciELO.listFavorites = function(){
    return SciELO.callWebServiceFunction("favorite/read");
};

SciELO.listCollections = function(){
    return SciELO.callWebServiceFunction("collection");
};

SciELO.unfavorite = function(idArticle){
    return SciELO.callWebServiceFunctionPOST("favorite/delete", {article_id: idArticle});
};

SciELO.changeLanguage = function (language){
    return SciELO.callWebServiceFunctionPOST("user/language", {language: language});
};

SciELO.changeFontSize = function (fontSize){
    return SciELO.callWebServiceFunctionPOST("user/font", {font_size: fontSize});
};

/**
 * 
 * @param {type} webServiceFunction Função que será chamada no webservice (com os parametros incluidos)
 * @param {type} isSessionCache Informar se o cache deve ser armazenado na sessao
 * @param {type} expirationTime Tempo em segundos de expiração do cache
 * @returns {jqXHR} Promise da função
 */
SciELO.cachedCall = function(webServiceFunction, params, isSessionCache, expirationTime){
    var deferred = $.Deferred();
    
    var key = webServiceFunction; // storage key
    
    if(SciELO.hasCache(key,isSessionCache)){
        
        var cachedObj = SciELO.getCache(key,isSessionCache);
        
        var dateNow = new Date();
        var expDate = new Date(cachedObj.creationDate);
        
        var diffDateSeconds = (dateNow - expDate) / 1000;
        if(diffDateSeconds > expirationTime){ // data do cache ja foi expirada
            //call ajax
            $.when(
                SciELO.callWebServiceFunction(webServiceFunction, params)
            ).then(
                 function(jsonObj){ // success
                     //guarda no cache
                     SciELO.saveCache(key, jsonObj, isSessionCache);

                     //retorna para o deferred
                     deferred.resolve(jsonObj);
                 }, 
                 function(){ // error
                     // obtem do cache
                     deferred.resolve(cachedObj.cachedData);
                 }
            );
        }else{ // cahce ainda não foi expirado
            deferred.resolve(cachedObj.cachedData);
        }
        
    }else{
        $.when(
            SciELO.callWebServiceFunction(webServiceFunction, params)
        ).then(
             function(jsonObj){ // success
                 //guarda no cache
                 SciELO.saveCache(key, jsonObj, isSessionCache);

                 //retorna para o deferred
                 deferred.resolve(jsonObj);
             }, 
             function(err){ // error
                 // em caso de erro nao tem como pegar do cache. O erro deve ser tratado no controller
                 deferred.reject(err);
             }
        );
    }
    
    return deferred.promise();
};

SciELO.hasCache = function(key, isSessionCache){
    if(isSessionCache){
        return (SciELO.sessionCache[key] !== null && typeof SciELO.sessionCache[key] !== 'undefined' );
    }else{
        return JSON.parse(window.localStorage.getItem(key)) !== null;
    }
};

SciELO.saveCache = function(key, jsonObj, isSessionCache){
    var cachedObj = {};
    cachedObj.cachedData = jsonObj;
    cachedObj.creationDate = new Date();
    
    if(isSessionCache){
        SciELO.sessionCache[key] = cachedObj;
    }else{
        window.localStorage.setItem(key, JSON.stringify(cachedObj));
    }
    
};

SciELO.getCache = function(key, isSessionCache){
    if(isSessionCache){
        return SciELO.sessionCache[key];
    }else{
        return JSON.parse(window.localStorage.getItem(key));
    }
    
};

SciELO.getCacheData = function(key, isSessionCache){
    var cache = SciELO.getCache(key, isSessionCache);
    if(cache) return cache.cachedData;
    else return null;
};

SciELO.removeCache = function(key, isSessionCache){
    if(isSessionCache){
        delete SciELO.sessionCache[key];
    }else{
        window.localStorage.removeItem(key);
    }
};

SciELO.callSOLRFunction = function(webServiceFunction, params){
    var callURL = SciELO.solrURL  + webServiceFunction;

    return $.ajax({
        url: callURL,
        dataType: 'json',
        timeout: 15000,
        type: 'GET',
        crossDomain: true,
        data: params
    });
};

SciELO.callWebServiceFunction = function(webServiceFunction, params){
    var callURL = SciELO.serverURL  + webServiceFunction;

    return $.ajax({
        url: callURL,
        dataType: 'json',
        timeout: 15000,
        type: 'GET',
        crossDomain: true,
        data: params
    });
};

SciELO.callWebServiceFunctionPOST = function(webServiceFunction, params){
    var callURL = SciELO.serverURL  + webServiceFunction;

    return $.ajax({
        url: callURL,
        dataType: 'json',
        timeout: 15000,
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(params)
    });
};