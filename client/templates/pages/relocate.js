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
  this.main = new ReactiveVar;
  this.main.set(null);
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
  "main": function () {
    return Template.instance().main.get();
  },
  "mainSubdivided": function () {
    var main = Template.instance().main.get();
    var fromdb = Locations.findOne({_id: main});
    return !!(fromdb.sublocations);
  }
});

Template.relocateMode.events({
  "change [name='locGroup']": function (event, template) {
    var radio = template.$( ':checked' ).filter( ':radio' ).filter( '[name="locGroup"]' );
    template.sub.set(null);
    template.main.set(radio.val());
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
    var itemId, location;
    usr = Meteor.user();
    itemId = template.$( '#rLScan' ).val();
    Session.set("relocateId", itemId);
    location = {
      main: template.main.get(),
      sub: template.sub.get(),
      moved_by: template.$( '#relocateBy' ).val(),
      comment: template.$( '#relocateComment' ).val(),
    }
    if (template.bulk.get()) {
      Meteor.call("moveItem", itemId, location, function (error, data) {
        if (error) {
          Flash.danger(error);
        }
      });
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
  location.main = template.main.get();
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
