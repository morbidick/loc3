require('leaflet-measure-path');
require('leaflet-draw-drag');
import "leaflet-measure-path/leaflet-measure-path.css";

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

	L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images/';

	var map = L.map('map', {
		crs: L.CRS.Simple,
		minZoom: 19,
		maxZoom: 22,
	});

	var areaLayers = new L.FeatureGroup();
	map.addLayer(areaLayers);


	if (Roles.userIsInRole(Meteor.userId(), ['areas-editor'])) {
		var drawControl = new L.Control.Draw({
			draw: {
				polygon: {
					allowIntersection: false,
					showArea: true,
				},

				rect: {
					shapeOptions: {
						color: 'green'
					},
				},
				polyline: false,
				polyline: false,
				circle: false,
				marker: false
			},

			edit: {
				remove: true,
				featureGroup: areaLayers,
				edit: {
					moveMarkers: true,
					selectedPathOptions: {
						maintainColor: true
					}
				}
			}
		});
		map.addControl(drawControl);
	}


	var northEast = map.unproject(L.point(0,599), 20);
	var southWest = map.unproject(L.point(1506, 0), 20);

	var maxLatLngBounds = L.latLngBounds(southWest, northEast);

	var hall_h = L.tileLayer('map-tiles/{z}/tiles_{x}_{y}.png', {
		minZoom: 19,
		maxZoom: 22,
		maxNativeZoom: 20,
		bounds: maxLatLngBounds
	}).addTo(map);

	map.setView(maxLatLngBounds.getCenter(), 20);


	map.on('draw:created', MapHelper.DrawEventHandler.drawCreated);
	map.on('draw:deleted', MapHelper.DrawEventHandler.drawDeleted);
	map.on('draw:edited', MapHelper.DrawEventHandler.drawEdited);

	var query = Areas.find();
	query.observe({
		added: function (newDocument) {
			drawArea(newDocument);
		},

		removed: function (oldDocument) {
			removeArea(oldDocument);
		},

		changed: function (newDocument, oldDocument) {
			removeArea(oldDocument);
			drawArea(newDocument);
		}
 	});


	function drawArea(areaDocument) {
		polygon = L.polygon(areaDocument.latLngs, { color: areaDocument.color } );
		polygon._leaflet_id = areaDocument._id;
		polygon.addTo(areaLayers).showMeasurements();

		polygon.on("click", function(e) {
			if (e.target.editing._enabled != true) {
				Router.go('editAreaPage', { _id: e.target._leaflet_id });
			}
		});

		var tooltip = polygon.bindTooltip(areaDocument.title, {permanent: true, offset: [0,20], direction:"center", className: "no-tooltip"}).openTooltip();

	}

	function removeArea(areaDocument) {
		layers = areaLayers._layers;
		var key, val;

		for (key in layers) {
			val = layers[key];

			if (val._leaflet_id == areaDocument._id) {
				areaLayers.removeLayer(val);
			}
		}
	}
};
