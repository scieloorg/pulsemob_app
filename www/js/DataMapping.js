var DataMapping = function() {
};

DataMapping.map = null;
DataMapping.chacheKey = "DataMapping";


DataMapping.loadMap = function() {

    //pega do cache inicialmente para ja ter dados carregados para as funcionalidades
    DataMapping.map = SciELO.getCacheData(DataMapping.chacheKey, false);
    
    if(!DataMapping.map){ // primeira vez abrindo o app
        DataMapping.loadFirstTimeCategoriesAndMagazines();
    }
};

DataMapping.loadFirstTimeCategoriesAndMagazines = function() {
    $.ajax({
        url: 'data/DataMapping.json',
        dataType: 'json',
        accepts: "application/json; encoding='utf-8'",
        async: false,
        success: function(jsonObj) {
            DataMapping.map = jsonObj;
            SciELO.saveCache(DataMapping.chacheKey, jsonObj, false);
        }
    });
};

DataMapping.checkVersion = function(version) {
    if(DataMapping.map.solr_version !== version){
        $.when(
            SciELO.dataMapping() 
        ).then( 
             function(json){
                DataMapping.map = json;
                SciELO.saveCache(DataMapping.chacheKey, json, false);
             }, 
             function(err){}
        );
    }
};

DataMapping.getAllCategories = function() {
    return Object.keys(DataMapping.map.categories);
};

DataMapping.getCategoryName = function(categoryId) {
    return DataMapping.map.categories[categoryId]["category_name_"+App.locale];
};

DataMapping.getAllMagazinesIds = function(categoryId) {
    return DataMapping.map.categories[categoryId].magazines;
};

DataMapping.getMagazineName = function(magazineId) {
    return DataMapping.map.magazines[magazineId].magazine_name;
};

DataMapping.getMagazineDomain = function(magazineId) {
    return DataMapping.map.magazines[magazineId].magazine_domain;
};

DataMapping.getMagazineAbbreviation = function(magazineId){
    return DataMapping.map.magazines[magazineId].magazine_abbreviated_title;
};

DataMapping.getMagazineAcronym = function(magazineId){
    return DataMapping.map.magazines[magazineId].magazine_acronym;
};

DataMapping.getMagazineISSN = function(magazineId){
    return DataMapping.map.magazines[magazineId].magazine_issn;
};

DataMapping.getCategoriesOrder = function() {
    return DataMapping.map["categories_order_"+App.locale];
};

DataMapping.getMagazinesOrder = function() {
    return DataMapping.map["magazines_order"];
};

DataMapping.getAllMagazines = function() {
    return DataMapping.map.magazines;
};