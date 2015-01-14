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



