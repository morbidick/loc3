Items = new Mongo.Collection('items');

Items.allow({  
  insert: function(){
    validate.authorized(Meteor.user(userId), "item-add");
    return true;
  },
  update: function(userId, post) {
    validate.authorized(Meteor.user(userId),"item-update");
    return true; 
  },  
  remove: function(userId, post) {
    validate.authorized(Meteor.user(userId),"item-remove");
    return true; 
  },
});

var fakeLocation = function () {
  var ret = {
    "type": Fake.fromArray(["world", "congress", "halleh", "transport"]),
    "timestamp": new Date(),
    "data1": Fake.word(),
    "data2": Fake.word(),
    "entry_by": Fake.word()
  };
  return ret;
};

// Do some preseeding for testing purposes
if(Meteor.isServer && Items.find().fetch().length < Meteor.settings.preseed.items.amount ) {
  Meteor.startup(function () {
    var id, ca, name, location, team, vendor, past, comment;
    var current = Items.find().fetch().length;
    for(var i=current; i < Meteor.settings.preseed.items.amount; i++) {
      var locations = [];
      var bounds = Math.floor((Math.random() * 10) + 1);
      for(var x=0; x<bounds; x++){
        var fake = fakeLocation();
        locations.push(fake);
      }
      id = "1234" + i.toString();
      ca = new Date();
      name = Fake.word();
      location = fakeLocation();
      team = Fake.word();
      vendor = Fake.word();
      past = locations;
      comment= Fake.sentence(15);

      Items.insert({
        "_id": id,
        "created_at": ca,
        "name": name,
        "location": location,
        "team": team,
        "vendor": vendor,
        "past_locations": past,
        "comment": comment
      });
    };
  });
}
