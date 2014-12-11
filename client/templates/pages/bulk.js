Template.bulkScan.events({
  "submit form": function (event, template) {
    var usr, scan;
	scan = template.$( '#scan' ).val();
  	if (/^\d{8}$/.test(scan)) {
	  	usr = Meteor.userId();
	  	if (usr) {
			Meteor.users.update(
				{"_id": usr}, 
				{$addToSet: {"scans": scan}}
			);
	    }
	    template.$( '#scan' ).val("");
  	}
  	//TODO notify of invalid scan
    return false;
  }
});

Template.bulkForm.events({
  "submit form": function (event, template) {
  	var name, team, vendor, location, data, radio, scans;

  	event.preventDefault();

  	name = template.$( '#submissionName' ).val();
    team = template.$( '#submissionTeam' ).val();
  	vendor = template.$( '#submissionVendor' ).val();
  	submissionBy = template.$( '#submissionBy' ).val();
  	radio = template.$( 'type:radio, input:checked' );

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
    	template.$( '#submissionName' ).val("");
    }
    else {
	    Session.set("submissionData", data);
    }
    return false;
  }
});

Template.bulkForm.helpers({
	"locationWorld": function() {
		return Session.get("submissionLocation") === "world";
	},
	"locationHalleH": function() {
		return Session.get("submissionLocation") === "halleh";
	},
	"locationCCH": function() {
		return Session.get("submissionLocation") === "cch";
	},
	"locationTransport": function() {
		return Session.get("submissionLocation") === "transport";
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

Template.bulkList.helpers({
	"scans": function () {
		return Meteor.user().scans.map(mapScan);
	}
});

Template.bulkList.events({
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