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

Template.relocatePage.helpers({
    "fromdb": function() {
    var itemId, data;
    itemId = Session.get("relocateId");
    if (!itemId) {
      return {found: false};
    }
    data = Items.findOne({"_id": itemId});
    if (!data) {
      return {found: false};
    }
    return {found: true, data: data};
  }
});

Template.relocateMode.created = function () {
  this.mode = new ReactiveVar;
  this.mode.set("none");
}

Template.relocateMode.helpers({
  "modeIs": function (mode) {
    var current = Template.instance().mode.get();
    return mode === current;
  }
});

//TODO remove ambiguity
Template.relocateMode.events({
  "change [name='locationsRadio1']": function (event, template) {
    var radio = template.$( "type:radio, input:checked" );
    console.log(radio.val());
    template.mode.set(radio.val());
  }
});

Template.sublocationsHalleH.created = function () {
  this.sublocation = new ReactiveVar;
  this.sublocation.set("none");
}

Template.sublocationsHalleH.helpers({
  "sublocationIs": function (sublocation) {
    var current = Template.instance().sublocation.get();
    return sublocation === current;    
  }
});

Template.sublocationsHalleH.events({
  "change [name='relocationRadio2']": function (event, template) {
    var radio = template.$( 'type:radio, input:checked' );
    template.sublocation.set(radio.val());
  }
});