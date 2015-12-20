Listings = new Mongo.Collection('listings');

Listings.allow({
  insert: function(userId, doc) {
    validate.authorized(Meteor.users.findOne(userId),"item-update");
    return true;
  },
  update: function(userId, doc) {
    validate.authorized(Meteor.users.findOne(userId),"item-update");
    return true;
  },
  remove: function(userId, doc) {
    validate.authorized(Meteor.users.findOne(userId),"item-update");
    return true;
  }
});
