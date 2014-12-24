Meteor.methods({
  addItems: function (itemIds, itemData) {
    validate.authorized(Meteor.user(), "item-add");
    if (!Meteor.user()) {
      throw new Meteor.Error("login-required", "check your privilege");
    }
    if (!validate.isArray(itemIds)) {
      throw new Meteor.Error("invalid-input", "Method expects array of items.");
    }
    for (var i = 0; i < itemIds.length; i++) {
      try { 
        ean8.isValid(itemIds[i]); 
      } catch (error) {
        throw error;
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
    if (!validate.isText(itemData.transport)) {
      throw new Meteor.Error("invalid-transport", "Transport is invalid.");
    }
    if (!validate.isText(itemData.comment)) {
      throw new Meteor.Error("invalid-comment", "Comment is invalid.");
    }
    
    itemData = validate.stripTo(itemData, ["name", "location", "team", "vendor", "transport", "comment"]);
    var locFields = ["main", "sub"];
    var additional = Locations.findOne({_id: itemData.location.main});
    if (additional) {
      locFields.concat(additional);
    }
    var itemLocation = validate.stripTo(itemData.location, locFields);
    var date = new Date();
    var user = Meteor.user();
    var userData = {name: user.username, id: user._id};
    itemLocation.timestamp = date;
    itemLocation.submitted_by = userData;
    
    itemData.location = itemLocation;
    itemData.timestamp = date;
    itemData.submitted_by = userData;
    for (var i = 0; i < itemIds.length; i++) {
      //TODO replace $set hack with proper document replacement
      Items.update({_id: itemIds[i]}, {$set: itemData}, {upsert: true});
    }
  },

  moveItem: function (itemId, location) {
    validate.authorized(Meteor.user(), "item-relocate");
    var locError = validate.checkLocation(location);
    var fromDb = Items.findOne({_id: itemId});
    if (!fromDb) {
      throw new Meteor.Error("invalid-scan", itemId + " does not reference a registered item. Enter item first or check if scan was valid.");
    }
    if (locError !== true) {
      throw new Meteor.Error("invalid-location", locError);
    }
    if (!validate.isText(location.moved_by)) {
      throw new Meteor.Error("invalid-moved_by", "moved_by field is expected to be text.");
    }
    if (!validate.isText(location.comment)) {
      throw new Meteor.Error("invalid-comment", "comment field is expected to be text.");
    }
    var locFields = ["main", "sub", "moved_by", "comment"];
    var additional = Locations.findOne({_id: location.main});
    if (additional) {
      locFields.concat(additional);
    }
    var location = validate.stripTo(location, locFields);
    var date = new Date();
    var user = Meteor.user();
    var userData = {name: user.username, id: user._id};
    location.timestamp = date;
    location.submitted_by = userData;
    Items.update( {_id: itemId},
      {
        $push: {past_locations: fromDb.location},
        $set: {location: location}
      }
    );
  },

  editItem: function (itemId, field, value) {
    var fromdb = Items.findOne({"_id": itemId});
    var usr = Meteor.userId();
    if (!fromdb) {
      throw new Meteor.Error("invalid-scan", itemId + " does not reference a registered item");
    }
    else if (field === "_id") {
      validate.authorized(usr, ["admin", "item-remove", "item-add"]);
      validate.isText(value);
    }
    else if (field === "name") {
      validate.authorized(usr, ["item-update"]);
      validate.isText(value);
    }
    else if (field === "vendor") {
      validate.authorized(usr, ["item-update"]);
      validate.isText(value);
    }
    else if (field === "comment") {
      validate.authorized(usr, ["item-update"]);
      validate.isText(value);
    }
    else if (field === "team") {
      validate.authorized(usr, ["item-update"]);
      validate.isText(value);
    }
    else {
      throw new Meteor.Error("invalid-input", "field cant be edited")
    }
    var query = {};
    query[field] = value;
    Items.update({_id: itemId}, {$set: query});
  }
});
