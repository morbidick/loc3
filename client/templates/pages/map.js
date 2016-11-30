// on startup run resizing event
Meteor.startup(function() {
	$(window).resize(function() {
		$('#map').css('height', window.innerHeight - 82 - 45);
	});

	$(window).resize(); // trigger resize event
	$.getScript('js/leaflet-measure-path.js');
});

// create marker collection
Meteor.subscribe('areas');

Template.mapPage.rendered = function() {
	$('#map').css('height', window.innerHeight - 82 - 45);

	var leafletMap = new LeafletMap("map", [
		new LeafletDataLayer("Halle H", ""),
		new LeafletDataLayer("Aufbauplan", "aufbau"),
		new LeafletDataLayer("Abbauplan", "abbau")
	]);




};
