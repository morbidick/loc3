Template.searchForm.created = function () {
  Session.set("searchQuery", {});
  Session.set("keys", []);
}

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
    if (query.subFilter && query.subFilter[0]) {
      mquery["location.sub"] = {"$in": query.subFilter};
    }
    for (field in query) {
      if (validate.isNonEmptyText(query[field])) {
        mquery[field] = new RegExp(query[field], 'i');                     // console.log(query[field]);      
      }
    }
    var results = Items.find(mquery);
    Session.set("resultQty", results.count());
    return results;
	},
  "keys": function () {
    //var fromdb = Items.findOne();
    //var keys = Object.keys(fromdb);
    var keys = ["_id", "name", "location", "team", "vendor", "comment", "submitted_by"];
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
  "present": function () {
    if (this.main) {
      if (validate.isNonEmptyText(this.sub)) {
        return this.main + ": " + this.sub;
      }
      return this.main;
    }
    if (this.name) {
      return this.name;
    }
    return this;
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
