Teams = new Mongo.Collection('teams');

Meteor.methods({
  addTeam: function(team) {
    if (!validate.isNonEmptyText(team._id)) {
      throw new Meteor.Error("name-empty", "you have to input a name!");
    }
    var team_exists = Teams.findOne(team._id);
    if (!team_exists) {
      Teams.insert(team);
      //TODO: add validation and return an error document
      return team;
    } else {
      throw new Meteor.Error("id-exists", "the given team name already exists!");
    }
  }
});

// Preseed the teams from the settings file
if(Meteor.isServer && Teams.find().fetch().length === 0 ) {
  Meteor.startup(function () {
    var teams = Meteor.settings.preseed.teams;
    for(var i = 0; i < teams.length; i++) {
      Teams.insert(teams[i]);
    };
  });
}
