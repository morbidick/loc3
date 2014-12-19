Template.searchForm.created = function () {
  Session.set("searchQuery", {});
}

// Fulltext search events
Template.searchForm.events({
  // Called whenever full search is used
  // commits an object describing the search to session
  "submit form": function (event, template) {
  	var name, team, vendor, locations, query;
  	// basic fields
    query = {
      name: template.$( '#queryName' ).val(),
      team: template.$( '#queryTeam' ).val(),
      vendor: template.$( '#queryVendor' ).val(),
      shipper: template.$( '#queryShipper' ).val()
    };
    var field;
    for (field in query) {
      query[field] = ".*" + query[field] + ".*";
      query[field] = new RegExp(query[field], "i");      
    }

    // check for correct location if (and only if) at least one location was set
    // locations = query["locations"];
    // if (locations.length > 0) {
    //   modq["location.type"] = {"$in": locations}
    //   active = true;
    // }
    // console.log(query);
    Session.set("searchQuery", query)
    // prevent default handler
    return false;
  }
});

// Fulltext search results helpers
Template.searchResults.helpers({
  "results": function() {
    var query = Session.get("searchQuery");
    var results = {};
    results = Items.find(query);
    Session.set("resultQty", results.count());
    return results;
	},
  "fields": function () {
    console.log(Session.get("searchQuery"));
    var fromdb = Items.findOne(Session.get("searchQuery"));
    console.log(fromdb);
    var keys = Object.keys(fromdb);
    console.log(keys);
    return keys;
  },
  "values": function (name) {
    console.log(Session.get("searchQuery"));
    var fromdb = Items.findOne(Session.get("searchQuery"));
    console.log(fromdb);
    var values = $.map(sublocations, function(el) { return el; });
    return values;
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
