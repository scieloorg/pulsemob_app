var Localization;

Localization = (function() {

    function Localization() {
    }
    
    Localization.refreshAppLocale = function(){
        Localization.loadLocaleFile("app.json",App.locale);
    };

    Localization.loadLocaleFile = function(stringFile) {
        Localization.dictionnary = Localization.getDictionnary(stringFile,App.locale);
        return Localization.applyToCurrentHtml();
    };

    Localization.getDictionnary = function(stringFile, locale) {
        var stringJSON;
        $.ajax({
            url: './strings/'+locale+'/'+stringFile,
            async: false,
            dataType: 'json',
            success: function(json) {
                stringJSON =  json;
            }
        });
        
        return stringJSON;
    };

    Localization.applyToCurrentHtml = function() {
        var key, value;
        
        for (key in Localization.dictionnary) {
            value = Localization.dictionnary[key];
            $("#string-" + key).html(value);
        }
    };

    Localization.getValue = function(key) {
        return Localization.dictionnary[key];
    };

    return Localization;

})();
