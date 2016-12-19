MapHelper = function() {
}

MapHelper.latLngsToObjectArray = function(latLngs) {
	var latLngsArray = [];

	latLngs.forEach(function (o) {
		latLngsArray.push({lat: o.lat, lng: o.lng});
	});

	return latLngsArray;
}
