Template.teamGroup.helpers({
	"registeredTeams": function () {
		var teams = Teams.find({}).fetch();
		teams.unshift({_id: ""});
		return teams;
	}
});