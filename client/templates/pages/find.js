Template.searchForm.created = function () {
  Session.set("searchQuery", {});
  Session.set("keys", []);
}

// Fulltext search events
Template.searchForm.events({
  // Called whenever full search is used
  // commits an object describing the search to session
  "submit form": function (event, template) {
  	var name, team, vendor, locations, query;
    query = {
      name: template.$( '#queryName' ).val(),
      team: template.$( '#queryTeam' ).val(),
      vendor: template.$( '#queryVendor' ).val()
    };
    // mainFilter = template.$( '.location-checkbox :checked' );
    // subFilter = [];
    console.log(mainFilter);
    var field;
    for (field in query) {
      if (validate.isEmptyText(query[field])) {
        delete query[field];
      }
    }
    console.log(query);
    Session.set("searchQuery", query)
    return false;
  }
});

// Fulltext search results helpers
Template.searchResults.helpers({
  "results": function() {
    var query = Session.get("searchQuery");
    for (field in query) {
      if (validate.isNonEmptyText(query[field])) {
        query[field] = new RegExp(query[field], 'i');                     // console.log(query[field]);      
      }
    }
    var results = Items.find(query);
    Session.set("resultQty", results.count());
    return results;
	},
  "keys": function () {
    var fromdb = Items.findOne();
    var keys = Object.keys(fromdb);
    console.log(keys);
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
