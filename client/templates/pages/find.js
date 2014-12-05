Template.searchForm.created = function () {
  Session.set("query", {"name": "", "team": "", "vendor": "", "locations": []});
}

Template.searchForm.events({
  "submit form": function (event) {
  	var name, team, vendor, locations, query;
  	name = $( '#queryName1' ).val();
    team = $( '#queryTeam1' ).val();
  	vendor = $( '#queryVendor1' ).val();

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
    // Meteor.call("logCommand", {"name": name, "team": team, "vendor": vendor, "locations": locations});
    Session.set("query", {"name": name, "team": team, "vendor": vendor, "locations": locations});
    return false;
  }
});

Template.searchResults.helpers({
	"results": function() {
		var query, name, team, vendor, locations, results, active;
		query = Session.get("query");
    name = "";
    var modq = {};
    if (query["name"] && query["name"] !== "") {
      name = ".*" + name + query["name"] + ".*";
      modq["name"] = {"$regex": name};
      active = true;
    }
    team = "";
    if (query["team"] && query["team"] !== "") {
      team = ".*" + team + query["team"] + ".*";
      modq["team"] = {"$regex": team};
      active = true;
    }
    vendor = "";
    if (query["vendor"] && query["vendor"] !== "") {
      vendor = ".*" + vendor + query["vendor"] + ".*";
      modq["vendor"] = {"$regex": vendor};
      active = true;
    }
    locations = query["locations"];
    if (locations.length > 0) {
      modq["location.type"] = {"$in": locations}
      active = true;
    }

    // Meteor.call("logCommand", modq);
    if(active) {
      results = Items.find(modq, {limit: 100});
      Session.set("resultQty", results.count());
    }
    return results;
	},

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

Template.findId.events({
  "submit form": function () {
    var itemId = $( '#queryId1' ).val();
    if ( /^\d{8}$/.test(itemId) ) {
      Session.set("findById", itemId);
    }
    return false;
  }
});

Template.presentId.helpers({
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