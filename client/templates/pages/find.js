Template.searchForm.created = function () {
	Session.set("searchQuery", {});
	Session.set("keys", []);
};
// Fulltext search events
Template.searchForm.events({
	// Called whenever full search is used
	// commits an object describing the search to session
	"submit form": function (event, template) {
		var query = {
			name: template.$( '#queryName' ).val(),
			team: template.$( '#queryTeam' ).val(),
			vendor: template.$( '#queryVendor' ).val()
		};
		var mainFilter = template.$( '.location-checkbox' ).filter(':checked').toArray();
		var subFilter = template.$( '.sublocation-checkbox' ).filter(':checked').toArray();
		var field;
		for (field in query) {
			if (validate.isEmptyText(query[field])) {
				delete query[field];
			}
		}
		query.mainFilter = $.map(mainFilter, function(el) { return el.value; });
		query.subFilter = $.map(subFilter, function(el) { return el.value; });
		Session.set("searchQuery", query);
		return false;
	}
});

// Fulltext search results helpers
Template.searchResults.helpers({
	"results": function() {
		var mquery = {};
		var query = Session.get("searchQuery");
		if (query.mainFilter && query.mainFilter[0]) {
			mquery["location.main"] = {"$in": query.mainFilter};
		}
		delete query.mainFilter;
		if (query.subFilter && query.subFilter[0]) {
			mquery["location.sub"] = {"$in": query.subFilter};
		}
		delete query.subFilter;
		for (field in query) {
			if (validate.isNonEmptyText(query[field])) {
				mquery[field] = new RegExp(query[field], 'i');
			}
		}
		var results = Items.find(mquery);
		Session.set("resultIds", results.map( function(doc) { return doc._id }));
		Session.set("resultQty", results.count());
		return results;
	},
	"keys": function () {
		//var fromdb = Items.findOne();
		//var keys = Object.keys(fromdb);
		var keys = ["_id", "name", "location", "default_location", "team", "vendor", "comment", "submitted_by"];
		Session.set("keys", keys);
		return keys;
	},
	"values": function (name) {
		// var values = $.map(this, function(el) { return el; });
		// return values;
		var arr = [];
		var keys = Session.get("keys");
		for (var i = 0; i < keys.length; i++) {
			arr.push(this[keys[i]]);
		}
		return arr;
	},
	"present": function (field) {
		switch (field) {
			case "id":
				return this._id;
			case "name":
				return this.name;
			case "location":      
				if (this.location.sub){
					return this.location.main + ": " + this.location.sub;
				}
				return this.location.main;
			case "default_location":
				if (this.defaultLocation) {
					if (this.defaultLocation.sub) {
						return this.defaultLocation.main + ": " + this.defaultLocation.sub;
					}
					return this.defaultLocation.main;
				}
				return "not set";
			case "team":
				return this.team;
			case "vendor":
				return this.vendor;
			case "comment":
				return this.comment;
			case "submitted_by":
				return this.submitted_by;
			default:
				throw new Meteor.Error("unknown field", "cant present field", JSON.stringify(field));
		}
	},
	// Checks for number of results
	"qty": function() {
		var resultQty = Session.get("resultQty");
		if((typeof resultQty) === "number" && resultQty > 0) {
			return resultQty + " results";
		}
		else {
			return "no results";
		}
	}
});

Template.massEdit.created = function () {
	this.editing = new ReactiveVar;
	this.editing.set(false);
	this.main = new ReactiveVar;
	this.main.set(null);
	this.sub = new ReactiveVar;
	this.sub.set(null);
};

Template.massEdit.helpers({
	"editing": function() {
		var state = Template.instance().editing.get();
		return state;
	},
	"editPrivilege": function () {
		validate.authorized(Meteor.userId(), ["admin", "item-update"])
		return true;
	},
	"main": function () {
		return Template.instance().main.get();
	},
	"hasSublocation": function () {
		var main = Template.instance().main.get();
		if (!main) {
			return false;
		}
		var fromdb = Locations.findOne({_id: main});
		if (fromdb && fromdb.sublocations) {
			return true;
		}
		return false;
	}
});

Template.massEdit.events({
	"click .edit-toggle": function(event, template) {
		var state = template.editing.get();
		template.editing.set(!state);
	},
	"click .edit-submit": function(event, template) {
		var ids = Session.get("resultIds");
		defaultLocation = { "main": template.main.get(),
									"sub": template.sub.get() };
		var edits = {
			'name': template.$( '#editName' ).val(),
			'team': template.$( '#editTeam' ).val(),
			'vendor': template.$( '#editVendor' ).val(),
			'defaultLocation': defaultLocation,
			'comment': template.$( '#editComment' ).val()
		};
		Meteor.call("bulkEdit", ids, edits, function (error, data) {
			if (error) {
				Flash.danger(error);
				window.scrollTo(0,0);
			}
			else {
				Flash.clear();
			}
		});
	},
	"change [name='locGroup']": function (event, template) {
		template.sub.set(null);
		template.main.set(event.target.value);
	},
	"change [name='subLocGroup']": function (event, template) {
		template.sub.set(event.target.value);
	}
});

Template.listing.created = function () {
	this.listingActive = new ReactiveVar;
	this.listingActive.set(false);
};

Template.listing.helpers({
	"listingActive": function() {
		var state = Template.instance().listingActive.get();
		return state;
	},
	"listingPrivilege": function () {
		validate.authorized(Meteor.userId(), ["admin", "item-update"])
		return true;
	}
});

Template.listing.events({
	"click .listing-toggle": function(event, template) {
		var state = template.listingActive.get();
		template.listingActive.set(!state);
	},
	"click .listing-submit": function(event, template) {
		var ids = Session.get("resultIds");
		var name = template.$( '#listingName' ).val();
		var comment = template.$( '#listingComment' ).val();
		Meteor.call("createListing", ids, name, comment, function (error, data) {
			if (error) {
				Flash.danger(error);
				window.scrollTo(0,0);
			}
			else {
				Flash.clear();
			}
		});
	}
});