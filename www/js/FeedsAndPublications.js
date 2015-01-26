var FeedsAndPublications = function() {
};

FeedsAndPublications.map = null;
FeedsAndPublications.chacheKey = "FeedsAndPublications";


FeedsAndPublications.loadMap = function() {

    //pega do cache inicialmente para ja ter dados carregados para as funcionalidades
    FeedsAndPublications.map = SciELO.getCacheData(FeedsAndPublications.chacheKey, false);
    
    if(!FeedsAndPublications.map){ // primeira vez abrindo o app
        FeedsAndPublications.loadFirstTimeLinesAndStations();
    }
};

FeedsAndPublications.loadFirstTimeLinesAndStations = function() {
    $.ajax({
        url: 'data/FeedsAndPublications.json',
        dataType: 'json',
        accepts: "application/json; encoding='utf-8'",
        async: false,
        success: function(jsonObj) {
            FeedsAndPublications.map = jsonObj;
            SciELO.saveCache(FeedsAndPublications.chacheKey, jsonObj, false);
        }
    });
};

FeedsAndPublications.checkVersion = function(version) {
    if(FeedsAndPublications.map.solr_version !== version){
        $.when(
            SciELO.feedsAndPublications() 
        ).then( 
             function(json){
                FeedsAndPublications.map = json;
                SciELO.saveCache(FeedsAndPublications.chacheKey, json, false);
             }, 
             function(err){}
        );
    }
};

FeedsAndPublications.getCategoryName = function(categoryId) {
    return FeedsAndPublications.map.feeds[categoryId]["feed_name_"+App.locale];
};

FeedsAndPublications.getAllJournalsIds = function(categoryId) {
    return FeedsAndPublications.map.feed_publication_relations[categoryId];
};

FeedsAndPublications.getJournalName = function(journalId) {
    return FeedsAndPublications.map.publications[journalId].publication_name;
};