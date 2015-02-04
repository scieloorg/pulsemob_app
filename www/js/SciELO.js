var SciELO = function(){};

SciELO.sessionCache = new Array();
//SciELO.serverURL = "http://localhost:8080/scielo/ws/";
SciELO.serverURL = "http://192.168.0.27:8000/";
//SciELO.serverURL = "http://http://infobase.cloudns.org:8001/";
//SciELO.serverURL = "http://192.168.0.2/";
SciELO.serverURL = "http://infobase.cloudns.org:8001/";


SciELO.loginUser = function(userInfo){
    return SciELO.callWebServiceFunctionPOST("webservices/login",userInfo);
};

SciELO.category = function(data){
    return SciELO.callWebServiceFunctionPOST("webservices/category", data);
};

SciELO.search = function(params){
    //chamada solr n tem /webservices
    return SciELO.callWebServiceFunction("search", params);
};

SciELO.feed = function(params){
    //chamada solr n tem /webservices
    return SciELO.callWebServiceFunction("feed", params);
};

SciELO.home = function(){
    return SciELO.cachedCall("webservices/home", {}, true, 60 * 60); // uma hora para expirar
};

SciELO.homeCleanCache = function(){
    SciELO.removeCache("webservices/home", true);
};

SciELO.feedsAndPublications = function(){
    return SciELO.callWebServiceFunction("webservices/feed/publications/list", {});
};

SciELO.favorite = function(idArticle){
    return SciELO.callWebServiceFunctionPOST("favorite/create", {article_id: idArticle});
};

SciELO.listFavorites = function(){
    return SciELO.callWebServiceFunction("favorite/read");
};

SciELO.unfavorite = function(idArticle){
    return SciELO.callWebServiceFunctionPOST("favorite/delete", {article_id: idArticle});
};

SciELO.uncheckFeed = function (idFeed){
    return SciELO.callWebServiceFunctionPOST("preferences/feed/exclusion/create", {feed_id: idFeed});
};

SciELO.checkFeed = function (idFeed){
    return SciELO.callWebServiceFunctionPOST("preferences/feed/exclusion/delete", {feed_id: idFeed});
};

SciELO.uncheckPublication = function (idPublication, idFeed){
    return SciELO.callWebServiceFunctionPOST("preferences/feed/publication/exclusion/create", {feed_id: idFeed, publication_id: idPublication});
};

SciELO.checkPublication = function (idPublication, idFeed){
    return SciELO.callWebServiceFunctionPOST("preferences/feed/publication/exclusion/delete", {feed_id: idFeed, publication_id: idPublication});
};

SciELO.changeLanguage = function (language){
    return SciELO.callWebServiceFunctionPOST("user/language", {language: language});
};

SciELO.changeFontSize = function (fontSize){
    return SciELO.callWebServiceFunctionPOST("user/language", {font_size: fontSize});
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
             function(){ // error
                 // em caso de erro nao tem como pegar do cache. O erro deve ser tratado no controller
                 deferred.reject("ERROR");
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