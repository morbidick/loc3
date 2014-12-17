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
  }
}
