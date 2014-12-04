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
		    scans.push({"scan": scan, "type": "INVALID: already set", "name": oldDoc.name, "location": oldDoc.location.type});    	    	
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
  	var name, team, vendor, location, query, radio;
  	name = $( '#submissionName1' ).val();
    team = $( '#submissionTeam1' ).val();
  	vendor = $( '#submissionVendor1' ).val();
  	submissionBy = $( '#submissionBy1' ).val();

  	// get radio status
  	radio = $( 'type:radio, input:checked' );
  	location = "";
  	if(radio.val()) {
  		location = radio.val();
  	}
    Meteor.call("logCommand", {"name": name, "team": team, "vendor": vendor, "submissionBy": submissionBy, "location": location});
    Session.set("submissionData", {"name": name, "team": team, "vendor": vendor, "submissionBy": submissionBy, "location": location});
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
	}
})

Template.scanResults.helpers({
	"results": function () {
		return Session.get("scans");
	}
});

var validScan = function (scan) {
	if (scan !== null && scan !== undefined && (typeof scan) === "string") {
		// scanning 8 digits?
		// /^203\d{5}$/  or suchlike
		return /^\d{8}$/.test(scan);
	}
	return false;
}