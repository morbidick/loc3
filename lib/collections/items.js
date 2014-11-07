Items = new Mongo.Collection('items');

Items.allow({  
  update: function(userId, post) { 
    return ownsDocument(userId, post); 
  },  
  remove: function(userId, post) {
    return ownsDocument(userId, post); 
  },
});
