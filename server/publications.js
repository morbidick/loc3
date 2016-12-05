Meteor.publish('items', function() {
  return Items.find();
});
Meteor.publish('transports', function() {
  return Transports.find();
});
Meteor.publish('locations', function() {
  return Locations.find();
});
Meteor.publish('teams', function() {
  return Teams.find();
});
Meteor.publish('listings', function() {
  return Listings.find();
});
Meteor.publish('layers', function() {
	return Layers.find();
});
Meteor.publish("userData", function () {
  if (Roles.userIsInRole(this.userId, "admin")) {
    return Meteor.users.find({},{fields: {_id:1, username: 1, roles: 1}});
  } else {
    this.ready();
  }
});
Meteor.publish(null, function (){
  return Meteor.roles.find()
});
Meteor.publish('files', function() {
	return Files.find();
});
Meteor.publish('areas', function() {
	return Areas.find();
});
