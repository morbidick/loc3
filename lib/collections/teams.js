Teams = new Mongo.Collection('teams');

Teams.allow({
  insert: function(userId, doc) {
    validate.authorized(Meteor.users.findOne(userId),"team-add");
    return true;
  }
});

Teams.attachSchema(new SimpleSchema({
  _id: {
    type: String,
    label: "Name",
    max: 50
  },
  primary_phone_number: {
    type: Number,
    optional: true,
    label: "Phone",
    min: 0
  },
  comment: {
    type: String,
    optional: true,
    label: "Brief summary",
  }
}));

// Preseed the teams from the settings file
if(Meteor.isServer && Teams.find().fetch().length === 0 ) {
  Meteor.startup(function () {
    var teams = Meteor.settings.preseed.teams;
    for(var i = 0; i < teams.length; i++) {
      Teams.insert(teams[i]);
    };
  });
}
