Template.scanForm.created = function () {
	Session.setDefault("scans", []);
	// Meteor.call("logCommand", "scans reset");
};

Template.scanForm.events({
  "submit form": function (event) {
    var text, scans, oldDoc;
  	scan = $( '#scan1' ).val();
  	Meteor.call("logCommand", scan);
    scans = Session.get("scans");

    if (validScan(scan)) {
	    oldDoc = Items.findOne({"_id": scan});
	    if (oldDoc) {
		    scans.push({"scan": scan, "type": "INVALID", "name": oldDoc.name, "location": oldDoc.location.type});    	    	
	    }
	    else {
		    scans.push({"scan": scan, "type": "VALID", "name": "new", "location": "new"});
	    }
	    Session.set("scans", scans);
    }
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
    	scans = Session.get("scans");
    	for (var i = 0; i < scans.length; i++) {
    		if (scans[i]["type"] === "VALID") {
		    	data["_id"] = scans[i].scan;
		    	// Meteor.call("logCommand", data);
    			Meteor.call("insertCommand", data);
    		}
    	}
    	$( '#submissionName1' ).val("");
    	Session.set("scans", []);
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
})

Template.scanResults.helpers({
	"results": function () {
		return Session.get("scans");
	}
});

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