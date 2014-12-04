Meteor.methods({
  logCommand: function (thing) {
    console.log(thing);
  },
  insertCommand: function (thing) {
  	Items.insert(thing);
  }
});