Template.scanForm.created = function () {
	Session.setDefault("scans", []);
};

Template.scanForm.events({
  "submit form": function (event) {
    var text, usr, scan, scans, oldDoc, data;
  	scan = $( '#scan1' ).val();
  	//check if we got a scan
  	if (validScan(scan)) {
    	//Set up data
	  	usr = Meteor.userId();
    	if (oldDoc) {
		}
		// Track scans via either user (more persistent) or session
	  	if (usr) {
			Meteor.users.update({"_id": usr}, {$addToSet: {"scans": scan}})
	    }
	    $( '#scan1' ).val("");
  	}
  	//TODO notify of invalid scan
  	// prevent default event handling
    return false;
  }
});

Template.submissionForm.events({
  "submit form": function (event) {
  	var name, team, vendor, location, data, radio, scans;

  	event.preventDefault();

  	name = $( '#submissionName1' ).val();
    team = $( '#submissionTeam1' ).val();
  	vendor = $( '#submissionVendor1' ).val();
  	submissionBy = $( '#submissionBy1' ).val();
  	radio = $( 'type:radio, input:checked' );

	location = {"type": radio.val(), "entry_by": submissionBy};
	data = {"name": name, "team": team, "vendor": vendor, "submissionBy": submissionBy, "location": location};

    if (validateSubmission(data)) {
    	scans = Meteor.user().scans.map(mapScan);
    	for (var i = 0; i < scans.length; i++) {
    		if (scans[i]["valid"]) {
		    	data["_id"] = scans[i].scan;
    			Meteor.call("insertCommand", data);
    		}
    	}
    	clearScans();
    	$( '#submissionName1' ).val("");
    }
    else {
	    Session.set("submissionData", data);
    }
    return false;
  }
});

Template.submissionForm.helpers({
	"locationWorld": function() {
		return false;
	},
	"locationHalleH": function() {
		return false;
	},
	"locationCCH": function() {
		return false;
	},
	"locationTransport": function() {
		return false;
	},
	"nameError": function() {
		var sD = Session.get("submissionData");
		return sD["name"] === "";	
	},
	"vendorError": function() {
		var sD = Session.get("submissionData");
		return sD["vendor"] === "";	
	},
	"teamError": function() {
		var sD = Session.get("submissionData");
		return sD["team"] === "";	
	}
});

Template.scanResults.helpers({
	"results": function () {
		return Meteor.user().scans.map(mapScan);
	}
});

Template.scanResults.events({
	"click .clear": function () {
		clearScans();
		return false;
	}
});

var mapScan = function (scan) {
	var doc = Items.findOne({"_id": scan});
	if (doc) {
		return {"scan": scan, "name": doc["name"], valid: false};
	}
	return {"scan": scan, "name": "new", valid: true};
}

var clearScans = function () {
	var usr = Meteor.userId();
	Meteor.users.update({"_id": usr}, {$set: {"scans": []}});
};

var getScans = function () {
 	var usr = Meteor.user();
	return usr.scans;
}

var validateSubmission = function (data) {
	if (!data["name"] || data["name"] === "") {
		return false;
	}
	if (!data["team"] || data["team"] === "") {
		return false;
	}
	if (!data["vendor"] || data["vendor"] === "") {
		return false;
	}
	return true;
}

var validScan = function (scan) {
	if (scan !== null && scan !== undefined && (typeof scan) === "string") {
		// scanning 8 digits?
		// /^203\d{5}$/  or suchlike
		return /^\d{8}$/.test(scan);
	}
	return false;
}