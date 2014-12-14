Template.locationGroup.helpers({
	"locations": function () {
		var locations = Locations.find().fetch();
		return locations;
	}
});
