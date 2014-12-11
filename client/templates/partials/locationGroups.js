Template.locationGroup.helpers({
	"locations": function () {
		console.log(Meteor.settings);
		var locations = Meteor.settings.public.locations; 
		return locations;
	}
});