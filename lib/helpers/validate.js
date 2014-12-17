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
  isEan8: function (string) {
    return true;
  },
  stripTo: function (item, fields) {
    var stripped = {};
    if (!this.isArray(fields)) {
      throw new Meteor.Error("invalid-input", "Fields should be an array.");
    }
    for (var i = 0; i < fields.length; i++) {
      stripped[fields[i]] = item[fields[i]];
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
    var dbEntry = Locations.findOne({name: location.main});
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
}