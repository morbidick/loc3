Transports = new Mongo.Collection('transports');

Transports.allow({  
  update: function(userId, post) { 
    return true; 
  },  
  remove: function(userId, post) {
    return true; 
  },
});

// name
// arrival_time
// departure_time
// comment
// vendor
// attachments
// prioritised