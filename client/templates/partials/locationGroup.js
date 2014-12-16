Template.locationGroup.helpers({
	"locations": function () {
		var locations = Locations.find().fetch();
		// var arr = $.map(locations, function(el) { return el; });
		return locations;
	}
});

Template.sublocationGroup.helpers({
	"sublocations": function(main) {
		var sublocations = Meteor.settings.public.sublocations[main];
		var arr = $.map(sublocations, function(el) { return el; });
		return arr;
	}
});
