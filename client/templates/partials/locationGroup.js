Template.locationGroup.helpers({
	"locations": function () {
		var locations = Meteor.settings.public.locations; 
		return locations;
	}
});

Template.sublocationGroup.helpers({
	"sublocations": function(loc) {
		var sublocations = Meteor.settings.public.sublocations[loc];
		return sublocations;
	}
});