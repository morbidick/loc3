Template.scanForm.created = function () {
	Session.setDefault("scans", []);
	// Meteor.call("logCommand", "scans reset");
};

Template.scanForm.events({
  "submit .scan": function (event) {
    var text, scans, oldDoc;
    text = event.target.text.value;
    event.target.text.value = "";
  	event.preventDefault();

    scans = Session.get("scans");
    if (validScan(text)) {
	    oldDoc = Items.findOne({"_id": text});
	    // Meteor.call("logCommand", oldDoc);
	    if (oldDoc) {
		    scans.push({"scan": text, "type": "INVALID: already set", "name": oldDoc.name, "location": oldDoc.location.type});    	    	
	    }
	    else {
		    scans.push({"scan": text, "type": "VALID", "name": "new", "location": "new"});
	    }
	    Session.set("scans", scans);
    }
    else {

    }
    return false;
  }
});

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