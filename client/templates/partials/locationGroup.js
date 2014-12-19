Template.locationGroup.helpers({
	"locations": function () {
		var locations = Locations.find().fetch();
		return locations;
	}
});

Template.sublocationGroup.helpers({
	"sublocations": function(main) {
		var sublocations = Locations.findOne({_id: main}).sublocations;
		var arr = $.map(sublocations, function(el) { return el; });
		return arr;
	}
});