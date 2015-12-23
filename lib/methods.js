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
    Items.update(
      {_id: itemId},
      {$push: {past_locations: fromDb.location},
	 $set: {location: location}},
      {$upsert: false}
    );
    Listings.update(
      {"itemId": itemId},
      {$set: {"resolved": true}},
      {upsert: false, multi: true}
    ); 
  },

  editItem: function (itemId, field, value) {
    validate.authorized(Meteor.user(), "item-update");
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
      validate.isText(value);
    }
    else if (field === "vendor") {
      validate.isText(value);
    }
    else if (field === "comment") {
      validate.isText(value);
    }
		else if (field === "team") {
			validate.isText(value);
		}
		else {
			throw new Meteor.Error("invalid-input", "field cant be edited")
		}
		var query = {};
		query[field] = value;
		Items.update({_id: itemId}, {$set: query});
	},

	bulkEdit: function (itemIds, updates) {
		validate.authorized(Meteor.user(), "item-update");
		validatedUpdates = {};
		if (validate.isNonEmptyText(updates['name'])) {
			validatedUpdates['name'] = updates['name'];
		}
		if (validate.isNonEmptyText(updates['team'])) {
			validatedUpdates['team'] = updates['team'];
		}
		if (validate.isNonEmptyText(updates['vendor'])) {
			validatedUpdates['vendor'] = updates['vendor'];
		}
		if (validate.checkLocation(updates['defaultLocation'])) {
			validatedUpdates['defaultLocation'] = updates['defaultLocation'];
		}
	if (validate.isNonEmptyText(updates['comment'])) {
		validatedUpdates['comment'] = updates['comment'];
	}
    var count = Items.find({"_id": {$in: itemIds}}).count();
    if (count !== itemIds.length) {
      throw new Meteor.Error("invalid-scan", "Cannot match all items in update query to existing items.");
    }
    Items.update({"_id": {$in: itemIds}}, {$set: validatedUpdates}, {upsert: false, multi: true})
  },

  createListing: function (itemIds, name, comment) {
    validate.authorized(Meteor.user(), "item-update");
    if (!(validate.isText(comment) && validate.isText(name))) {
      throw new Meteor.Error("invalid-input", "Name and Comment for a listing need to be text.");
    }
    var listingItems = Items.find({"_id": {$in: itemIds}});
    listingItems.forEach(function(doc) {
      var myId = doc._id;
      Listings.insert({
	 "name": name,
	 "comment": comment,
	 "itemId": myId,
	 "resolved": false,
	 "lastLocation": doc.location
      });
      Items.update(
	 {"_id": myId},
	 {$push: {"pastLocations": doc.location}},
	 {upsert: false, multi: false}
      );
      Items.update(
	 {"_id": myId},
	 {$set: {"location": {"main": "world", "sub": "none"}}},
	 {upsert: false, multi: false}
      );
    });
  },

  scanListing: function (itemIds, listingName, location) {
    validate.authorized(Meteor.user(), "item-update");
    validate.checkLocation(location);
    itemIds.forEach(
      function(id) { moveItem(id, location); }
    );
    Listings.update(
      {"name": listingName, "itemId": {$in: itemIds}},
      {$set: {"resolved": true}},
      {upsert: false, multi: true}
    );
  }
});

if (Meteor.isServer) {
  Meteor.methods({
    listingsDistinct: function (name) {
      var rawListings = Listings.rawCollection();
      var distinctWrapper = Meteor.wrapAsync(rawListings.distinct, rawListings);
      var dist = distinctWrapper(name);
      var descriptions = [];
      dist.forEach(
	 function(name) {
	   var comment = Listings.findOne({"name": name}).comment;
	   var total = Listings.find({"name": name}).count();
	   var resolved = Listings.find({"name": name, "resolved": true}).count();
	   var unresolved = total - resolved;
	   descriptions.push({"name": name, "comment": comment, "total": total, "resolved": resolved, "unresolved": unresolved});
	 }
      );
      return descriptions;
    }
  });
}
