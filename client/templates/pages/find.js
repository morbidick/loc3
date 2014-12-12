Template.searchForm.created = function () {
  // TODO figure out setDefaults behavior and why it seems to be confusing if used here 
  Session.set("query", {"name": "", "team": "", "vendor": "", "locations": []});
}

// Fulltext search events
Template.searchForm.events({
  // Called whenever full search is used
  // commits an object describing the search to session
  "submit form": function (event, template) {
  	var name, team, vendor, locations, query;
  	// basic fields
    name = $( '#queryName1' ).val();
    team = $( '#queryTeam1' ).val();
  	vendor = $( '#queryVendor1' ).val();

    // location checkboxes
  	locations = [];
  	if ( $( '#queryLocations1' ).prop( 'checked' ) ) {
	  	locations.push("world");		
  	}
  	if ( $( '#queryLocations2' ).prop( 'checked' ) ) {
  		locations.push("halleh");
  	}
  	if ( $( '#queryLocations3' ).prop( 'checked' ) ) {
	  	locations.push("congress");  		
  	}
  	if ( $( '#queryLocations4' ).prop( 'checked' ) ) {
  		locations.push("transport");
  	}

    Session.set("query", {"name": name, "team": team, "vendor": vendor, "locations": locations});
    // prevent default handler
    return false;
  }
});

// Fulltext search results helpers
Template.searchResults.helpers({
	"results": function() {
		var query, name, team, vendor, locations, results, active;
		query = Session.get("query");
    name = "";
    var modq = {};
    // check we are active, i.e. a meaningfull search was submitted
    if (query["name"] && query["name"] !== "") {
      // build ourselves a regex for case insensitive fulltext
      name = ".*" + name + query["name"] + ".*";
      name = new RegExp(name, "i");
      modq["name"] = {"$regex": name};
      active = true;
    }
    team = "";
    if (query["team"] && query["team"] !== "") {
      team = ".*" + team + query["team"] + ".*";
      team = new RegExp(team, "i");
      modq["team"] = {"$regex": team};
      active = true;
    }
    vendor = "";
    if (query["vendor"] && query["vendor"] !== "") {
      vendor = ".*" + vendor + query["vendor"] + ".*";
      vendor = new RegExp(vendor, "i");
      modq["vendor"] = {"$regex": vendor};
      active = true;
    }
    // check for correct location if (and only if) at least one location was set
    locations = query["locations"];
    if (locations.length > 0) {
      modq["location.type"] = {"$in": locations}
      active = true;
    }
    // TODO push database action to server
    if(active) {
      results = Items.find(modq, {limit: 100});
      Session.set("resultQty", results.count());
    }
    return results;
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
