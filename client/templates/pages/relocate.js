Template.relocateScan.events({
  "submit form": function (event, template) {
    var usr, scan;
	scan = template.$( '#scan' ).val();
  	if (/^\d{8}$/.test(scan)) {
	  	usr = Meteor.userId();
	  	if (usr) {	  		
			Session.set("relocateId", scan);
	    }
	    template.$( '#scan' ).val("");
  	}
  	//TODO notify of invalid scan
    return false;
  }
});

Template.relocateMode.created = function () {
  Session.set("relocateMode", "world");
}

Template.relocateMode.helpers({
  "modeIs": function (mode) {
    return mode === (Session.get("relocateMode"));
  }
});

//TODO remove ambiguity
Template.relocateMode.events({
  "change [name='relocationRadio1']": function (event, template) {
    var radio = template.$( "type:radio, input:checked" );
    Session.set("relocateMode", radio.val());
  }
});

Template.relocateMode.created = function () {
  Session.set("relocateSublocation", "custom");
}

Template.sublocationsHalleH.helpers({
  "sublocationIs": function (sublocation) {
    return sublocation === (Session.get("relocateSublocation"));    
  }
});

Template.sublocationsHalleH.events({
  "change [name='relocationRadio2']": function (event, template) {
    var radio = template.$( 'type:radio, input:checked' );
    Meteor.call("logCommand", radio.val());
    Session.set("relocateSublocation", radio.val());
  }
});