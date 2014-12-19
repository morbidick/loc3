validate = {
  isText: function(string) {
    if(typeof string === "string") {
      return true;
    } else {
      return false;
    }
  },
  isEmptyText: function(string){
    if(this.isText(string) && string === "") {
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
    return string.match(/^\d+$/);
  },
  stripTo: function (item, fields) {
    var stripped = {};
    if (!this.isArray(fields)) {
      throw new Meteor.Error("invalid-input", "Fields should be an array.");
    }
    for (var i = 0; i < fields.length; i++) {
      if (item[fields[i]] !== undefined && item[fields[i]] !== null) {
        stripped[fields[i]] = item[fields[i]];
      }
    }
    return stripped;
  },
  isArray: function (value) {
    return Object.prototype.toString.apply(value) === '[object Array]';
  },
  checkLocation: function (location) {
    if (!location.main) {
      return "Main location is unset.";
    }
    var dbEntry = Locations.findOne({_id: location.main});
    if (!this.isText(location.main) || !dbEntry) {
      return "Main location is invalid.";
    }
    if (location.sub) {
      if (!this.isText(location.sub)) {
        return "Sublocation is invalid";
      }
      if (!dbEntry.sublocations[location.sub]) {
        return "Main to sublocation mismatch";
      }
    }
    else if (dbEntry.sublocationMandatory) {
      return "This main location needs a sublocation to be set.";
    }
    return true;
  },
  isDate: function (d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
      return false;
    return !isNaN(d.getTime());
  }
}
