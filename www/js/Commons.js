var Commons = function() {};


String.prototype.hashCode = function() {
    var aux = "v1.0" + this;
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = aux.length; i < len; i++) {
        chr   = aux.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    
    return hash;
};


String.prototype.formatToDateTBS = function() {
    var date = new Date(this);
    
    var formattedDate = null;
    var month  = ""+(date.getMonth() + 1);
    if(month.length !== 2) month = "0"+month;
    
    var day  = ""+date.getDate();
    if(day.length !== 2) day = "0"+day;
    
    var hours  = ""+date.getHours();
    if(hours.length !== 2) hours = "0"+hours;
    
    var min  = ""+date.getMinutes();
    if(min.length !== 2) min = "0"+min;
    
    var sec  = ""+date.getSeconds();
    if(sec.length !== 2) sec = "0"+sec;
    
    formattedDate = hours + ":" + min + ":" + sec + " " + day + "/" +month + "/" + date.getFullYear();
    
    return formattedDate;
};



