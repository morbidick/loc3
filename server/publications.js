Meteor.publish('items', function() {
  return Items.find();
});
Meteor.publish('transports', function() {
  return Transports.find();
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'scans': 1}});
  } else {
    this.ready();
  }
});