validate = {
  isText: function (string) {
    if (typeof string === "string") {
      return true;
    }
    throw new Meteor.Error("invalid-input", "Text input expected.");
  },
  isEmptyText: function (string) {
    if (this.isText(string) && string === "") {
      return true;
    }
    return false;
  },
  isNonEmptyText: function (string) {
    if (this.isText(string) && string !== "") {
      return true;
    }
    return false;
  },
  isEan8: function (string) {
    return ean8.isValid(string);
  },
  isNumeric: function (string) {
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
      throw new Meteor.Error("invalid-location", "Main location is not set.");
    }
    var dbEntry = Locations.findOne({_id: location.main});
    if (!this.isText(location.main) || !dbEntry) {
      throw new Meteor.Error("invalid-input", "Invalid main location.");
    }
    if (location.sub) {
      if (!this.isText(location.sub)) {
        throw new Meteor.Error("invalid-input", "Invalid sublocation.");
      }
      if (!dbEntry.sublocations[location.sub]) {
        throw new Meteor.Error("invalid-input", "Sublocation does not match main location.");
      }
    }
    else if (dbEntry.sublocationMandatory) {
      throw new Meteor.Error("invalid-input", "Set main location expects a sublocation.");
    }
    return true;
  },
  isDate: function (d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
      return false;
    return !isNaN(d.getTime());
  },
  authorized: function(user,required_permission) {
    if (Roles.userIsInRole(user, required_permission)) {
      return true;
    }
    throw new Meteor.Error(403, "Not authorized!");
  }
}
