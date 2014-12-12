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
  this.sublocation = new ReactiveVar;
  this.sublocation.set("none");

  this.bulk = new ReactiveVar;
  this.state = new ReactiveVar;
  this.autolocation = new ReactiveVar;
  this.bulk.set(true);
  this.state.set(true);
  this.autolocation.set(true);
}

var isSubdivided = function (location) {
    var sublocations = Meteor.settings.public.sublocations; 
    if (sublocations[location]) {
      return true;
    }
    return false;  
}

Template.relocateMode.helpers({
  "mode": function () {
    return Template.instance().mode.get();
  },
  "modeIs": function (mode) {
    var current = Template.instance().mode.get();
    return mode === current;
  },
  "modeSubdivided": function (mode) {
    var isIt = isSubdivided(mode);
    return isIt;
  }
});

Template.relocateMode.events({
  "change [name='locGroup']": function (event, template) {
    var radio = template.$( ':checked' ).filter( ':radio' ).filter( '[name="locGroup"]' );
    template.mode.set(radio.val());
  },

  "change [name='locGroup']": function (event, template) {
    var radio = template.$( ':checked' ).filter( ':radio' ).filter( '[name="locGroup"]' );
    template.mode.set(radio.val());
  },  

  "change [name='relocateBulkOption']": function (event, template) {
    var current = template.bulk.get();
    template.bulk.set(!current);
  },

  "change [name='relocateStateOption']": function (event, template) {
    var current = template.state.get();
    template.state.set(!current);
  },

  "change [name='relocateAutolocationOption']": function (event, template) {
    var current = template.autolocation.get();
    template.autolocation.set(!current);
  },

  "click .tester": function (event, template) {
    var scan, location, sublocation, date, submittedby, movedby, comment;
    scan = template.$( '#rLScan' ).val(); 
    location = template.mode.get();
    sublocation = "unused";
    if (isSubdivided(location)) { 
      var radio = template.$( '[name="subLocGroup"]' ).filter( ':radio' ).filter( ':checked' );
      sublocation = radio.val();
    }
    date = new Date();
    submittedby = Meteor.userId();
    movedby = template.$( '#relocateBy' ).val();
    comment = template.$( '#relocateComment' ).val();
    console.log(scan);
    console.log(location);
    console.log(sublocation);
    console.log(date);
    console.log(submittedby);
    console.log(movedby);
    console.log(comment);
  }
});