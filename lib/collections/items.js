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
    Items.insert({
      _id: i.toString(),
      name: "item" + i,
      location: "halle_h"
    });
  }
}
