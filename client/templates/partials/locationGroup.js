Template.locationGroup.helpers({
	"locations": function () {
		var locations = Meteor.settings.public.locations; 
		return locations;
	}
});