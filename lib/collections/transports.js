Transports = new Mongo.Collection('transports');

Transports.allow({  
  update: function(userId, post) { 
    return true; 
  },  
  remove: function(userId, post) {
    return true; 
  },
});
