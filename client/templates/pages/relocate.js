
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
  this.mode.set(null);
  this.sub = new ReactiveVar;
  this.sub.set(null);

  this.bulk = new ReactiveVar;
  this.state = new ReactiveVar;
  this.autolocation = new ReactiveVar;
  this.bulk.set(true);
  this.state.set(true);
  this.autolocation.set(true);
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

  "change [name='subLocGroup']": function (event, template) {
    var radio = template.$( ':checked' ).filter( ':radio' ).filter( '[name="subLocGroup"]' );
    template.sub.set(radio.val());
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

  "submit .scan": function (event, template) {
    var data, radio, usr, scan, location, locationUpdate, itemId;
    usr = Meteor.user();
    if (!usr) {
      //please log in somethingsomething
      console.log("missing user");
      return false;
    }       
    scan = template.$( '#rLScan' ).val(); 
    if (!/^\d{8}$/.test(scan)) {
       //invalid scan somethingsomething
      console.log("invalid scan");
      return false;
    }
    data = Items.findOne({"_id": scan});
    if (!data) {
      //no such item somethingsomething
      console.log("none such item")
      return false;
    }
    Session.set("relocateId", scan);

    moveTo = resolveLocation(template, data);
    if (!moveTo.main || moveTo.sub === null) {
      //missing location somethingsomething
      console.log("cant resolve location, provide one pls");
      return false;
    }
    locationUpdate = {};
    locationUpdate.type = moveTo.main;
    locationUpdate.moved_by = template.$( '#relocateBy' ).val();
    locationUpdate.entry_by = usr.username;
    locationUpdate.comment = template.$( '#relocateComment' ).val();
    locationUpdate.timestamp = new Date();
    if (moveTo.sub) {
      locationUpdate.sublocation = moveTo.sub;
    }
    if (template.bulk.get()) {
      var past = data.past_locations;
      past.unshift(data.location);
      Items.update({_id: scan}, {$set: {past_locations: past, location: locationUpdate}});
    }
    if (!template.state.get()) {
      template.$( '#relocateBy' ).val("");
      template.$( '#relocateComment' ).val("");
    }
    return false;
  }
});

var isSubdivided = function (location) {
    var sublocations = Meteor.settings.public.sublocations; 
    if (sublocations[location]) {
      return true;
    }
    return false;  
}

var resolveLocation = function (template, item) {
  var team, preferred, auto, location;
  location = {};
  location.main = template.mode.get();
  auto = template.autolocation.get();
  if (isSubdivided(location.main)) {
    location.sub = null;
    radio = template.$( '[name="subLocGroup"]' ).filter( ':radio' ).filter( ':checked' );
    if(radio.val()) {
      location.sub = radio.val();
    }
    // else {
    //   if (auto) {
    //     team = Teams.findOne({_id: item.team});
    //     if (team) {
    //       preferred = team.defaultSublocations[location.main];
    //       if (preferred) {
    //         location.sub = preferred;
    //       }
    //     }
    //   }
    // }
  }
  return location; 
} 