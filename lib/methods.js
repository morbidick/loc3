Meteor.methods({
  addItems: function (itemIds, itemData) {
    if (!validate.isArray(itemIds)) {
      throw new Meteor.Error("invalid-input", "Method expects array of items.");
    }
    for (var i = 0; i < itemIds.length; i++) {
      if (!validate.isEan8(itemIds[i])) {
        throw new Meteor.Error("invalid-scan", itemIds[i] + " is either prefixed wrong or not valid ean8.");
      }
    }
    if (!validate.isNonEmptyText(itemData.name)) {
      throw new Meteor.Error("invalid-name", "Itemname is invalid.");
    }
    var locError = validate.checkLocation(itemData.location);
    if (locError !== true) {
      throw new Meteor.Error("invalid-location", locError);
    }
    if (!validate.isText(itemData.vendor)) {
      throw new Meteor.Error("invalid-vendor", "Vendor is invalid.");
    }
    if (!validate.isText(itemData.team)) {
      throw new Meteor.Error("invalid-team", "Team is invalid.");
    }
    if (!validate.isText(itemData.comment)) {
      throw new Meteor.Error("invalid-comment", "Comment is invalid.");
    }
    itemData = validate.stripTo(itemData, ["_id", "name", "location", "team", "vendor", "comment"]);
    var locFields = ["main", "sub"];
    var additional = Locations.findOne({name: itemData.location.main});
    if (additional) {
      locFields.concat(additional);
    }
    itemData.location = validate.stripTo(itemData.location, locFields);
    console.log(itemIds);
    console.log(itemData);
  }
});