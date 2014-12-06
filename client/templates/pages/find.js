Template.searchForm.created = function () {
  // TODO figure out setDefaults behavior and why it seems to be confusing if used here 
  Session.set("query", {"name": "", "team": "", "vendor": "", "locations": []});
}

// Fulltext search events
Template.searchForm.events({
  // Called whenever full search is used
  // commits an object describing the search to session
  "submit form": function (event) {
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

// Find by id events
Template.findId.events({
  "submit form": function () {
    var itemId = $( '#queryId1' ).val();
    // TODO update this to use a global and more specific query
    if ( /^\d{8}$/.test(itemId) ) {
      Session.set("findById", itemId);
    }
    // prevent default
    return false;
  }
});

// Detailed item description helpers
Template.presentValue.helpers({
  // check if a given value is being edited
  "notEditing": function(heading) {
    var state;
    state = Session.get("findIdEditing_" + heading);
    return !state;
  },
});

// Detailed item description events (editing)
Template.presentValue.events({
  "submit form": function () {
    var refId, dbName, newData, state;
    refId = this.refId;
    dbName = this.dbName;
    newData = {};
    // TODO figure out if there is a less ugly way of doing this
    newData[dbName] = $( '[editingTag="'+this.heading+'"]').val();
    Items.update({"_id": refId}, {$set: newData});
    // toggle editing
    state = Session.get("findIdEditing_" + this.heading);
    Session.set("findIdEditing_" + this.heading, !state);
    
    return false;
  },
  "click .toggleEdit": function() {
    var state;
    state = Session.get("findIdEditing_" + this.heading);
    Session.set("findIdEditing_" + this.heading, !state);
    return false;   
  }
});

// Detailed item description helpers
Template.presentId.helpers({
  // Get a single doc from our db referred to by the session 
  "fromdb": function() {
    var itemId, data;
    itemId = Session.get("findById");
    if (!itemId) {
      return {found: false};
    }
    data = Items.findOne({"_id": itemId});
    if (!data) {
      return {found: false};
    }
    data.found = true;
    return data;
  }
});