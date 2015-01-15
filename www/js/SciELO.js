var SciELO = function(){};

SciELO.sessionCache = new Array();
SciELO.serverURL = "http://localhost:8080/scielo/ws/";


SciELO.loginUser = function(userInfo){
    return SciELO.callWebServiceFunctionPOST("login",userInfo);
};

SciELO.category = function(data){
    return SciELO.callWebServiceFunctionPOST("category", data);
};

/**
 * 
 * @param {type} webServiceFunction Função que será chamada no webservice (com os parametros incluidos)
 * @param {type} isSessionCache Informar se o cache deve ser armazenado na sessao
 * @param {type} expirationTime Tempo em segundos de expiração do cache
 * @returns {jqXHR} Promise da função
 */
SciELO.cachedCall = function(webServiceFunction, isSessionCache, expirationTime){
    var deferred = $.Deferred();
    
    var key = webServiceFunction.hashCode(); // storage key
    
    if(SciELO.hasCache(key,isSessionCache)){
        
        var cachedObj = SciELO.getCache(key,isSessionCache);
        
        var dateNow = new Date();
        var expDate = new Date(cachedObj.creationDate);
        
        var diffDateSeconds = (dateNow - expDate) / 1000;
        if(diffDateSeconds > expirationTime){ // data do cache ja foi expirada
            //call ajax
            $.when(
                SciELO.callWebServiceFunction(webServiceFunction)
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
            SciELO.callWebServiceFunction(webServiceFunction)
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
    return cache.cachedData;
};

SciELO.removeCache = function(key){
    window.localStorage.removeItem(key);
};

SciELO.callWebServiceFunction = function(webServiceFunction){
    var callURL = SciELO.serverURL  + webServiceFunction;

    return $.ajax({
        url: callURL,
        dataType: 'json',
        timeout: 15000,
        crossDomain: true,
        type: 'GET'
    });
};

SciELO.callWebServiceFunctionWithParams = function(webServiceFunction, params){
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