Locations = new Mongo.Collection('locations');

// Preseed the Locations from the settings file
if(Meteor.isServer && Locations.find().fetch().length === 0 ) {
  Meteor.startup(function () {
    var locations = Meteor.settings.preseed.locations;
    for(var i = 0; i < locations.length; i++) {
      Locations.insert(locations[i]);
    };
  });
}
