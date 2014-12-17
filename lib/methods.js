Meteor.methods({
  logCommand: function (thing) {
    console.log(thing);
  },
  registerItem: function (item) {
    // if (!isEan8(item._id)) {
    //   throw new Meteor.Error();
    // }
    if (!isNonemptyText(item.name)) {
      throw new Meteor.Error("invalid-name", "Itemname is invalid.");
    }
    var locError = isLocation(item.location);
    if (locError) {
      throw new Meteor.Error("invalid-location", locError);
    }
    if (!isText(item.vendor)) {
      throw new Meteor.Error("invalid-vendor", "Vendor is invalid.");
    }
    if (!isText(item.team)) {
      throw new Meteor.Error("invalid-team", "Team is invalid.");
    }
    if (!isText(item.comment)) {
      throw new Meteor.Error("invalid-comment", "Comment is invalid.");
    }
    item = stripTo(item.location, ["_id", "name", "location", "team", "vendor", "comment"]);
    var locFields = ["main", "sub"];
    var additional = Locations.findOne({name: item.location.main};
    if (additional) {
      locFields.concat(additional);
    }
    item.location = stripTo(item.location, locFields);
  }
});

var stripTo = function (item, fields) {
  var stripped = {};
  for (var i = 0; i < fields.length; i++) {
    stripped[fields[i]] = item[fields[i]];
  }
}

var stripLocation = function (location) {

}

var isLocation = function (location) {
  if (!location.main) {
    return "Main location is unset.";
  }
  var dbEntry = Locations.findOne({name: location.main});
  if (!isText(location.main) || !dbEntry) {
    return "Main location is invalid.";
  }
  if (location.sub) {
    if (!isText(location.sub)) {
      return "Sublocation is invalid";
    }
    if (!dbEntry.sublocations[location.sub]) {
      return "Main to sublocation mismatch";
    }
  }
  else if (dbEntry.sublocationMandatory) {
    return "This main location needs a sublocation to be set.";
  }
};

var validateLocation = function (main, sub) {
  if (!Meteor.settings.public.locations.main) {
    return false;
  }
  if (!Meteor.settings.public.sublocations.main.sub) {
    return false;
  }
  return true;
};

var isText = function (thing) {
  return (typeof thing === "string");
};

var isNonemptyText = function (thing) {
  return (typeof thing === "string" && thing !== "");
};