validate = {
  isText: function(string) {
    if(typeof string === "string") {
      return true;
    } else {
      return false;
    }
  },
  isNonEmptyText: function(string){
    if(this.isText(string) && string !== "") {
      return true;
    } else {
      return false;
    }
  },
  isEan8: function(string) {
    return ean8.isValid(string);
  },
  isNumeric: function(string) {
    //string.match(/^\d+$/)
    return $.isNumeric(string);
  }
}
