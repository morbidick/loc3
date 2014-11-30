Items = new Mongo.Collection('items');
var preseed_items = 1000;

Items.allow({  
  update: function(userId, post) { 
    return true; 
  },  
  remove: function(userId, post) {
    return true; 
  },
});


// Do some preseeding for testing purposes
if(Meteor.isServer && Items.find().fetch().length === 0) {
  for(var i=0; i<preseed_items; i++) {
    var locations = [];
    var bounds = Math.floor((Math.random() * 10) + 1);
    for(var x=0; x<bounds; x++){
      locations.push(fakeLocation());
    }
    Items.insert({
      "_id": i,
      "created_at": new Date(),
      "name": Fake.word(),
      "location": FakeLocation(),
      "team_id": Fake.word(),
      "vendor_id": Fake.word(),
      "past_locations": locations(),
      "comment": Fake.sentence(15)
    });
  }

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
}