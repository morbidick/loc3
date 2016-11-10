// on startup run resizing event
Meteor.startup(function() {
	$(window).resize(function() {
		$('#map').css('height', window.innerHeight - 82 - 45);
	});

	$(window).resize(); // trigger resize event
});

// create marker collection
Meteor.subscribe('areas');

Template.mapPage.rendered = function() {
	$('#map').css('height', window.innerHeight - 82 - 45);

	L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images/';

	L.LabelOverlay = L.Class.extend({
		initialize: function (latLng, label, options) {
			this._latlng = latLng;
			this._label = label;
			L.Util.setOptions(this, options);
		},
		options: {
			offset: new L.Point(0, 2)
		},
		onAdd: function (map) {
			this._map = map;
			if (!this._container) {
				this._initLayout();
			}
			map.getPanes().overlayPane.appendChild(this._container);
			this._container.innerHTML = this._label;
			map.on('viewreset', this._reset, this);
			this._reset();
		},
		onRemove: function (map) {
			map.getPanes().overlayPane.removeChild(this._container);
			map.off('viewreset', this._reset, this);
		},
		_reset: function () {
			console.log(this._container.style.width);
			var pos = this._map.latLngToLayerPoint(this._latlng);
			var op = new L.Point(pos.x + this.options.offset.x, pos.y - this.options.offset.y);
			L.DomUtil.setPosition(this._container, op);
		},
		_initLayout: function () {
			this._container = L.DomUtil.create('div', 'leaflet-label-overlay');
		}
	});



	var map = L.map('map', {
		crs: L.CRS.Simple,
		minZoom: 18,
		maxZoom: 20,
	});

	var areaLayers = new L.FeatureGroup();
	map.addLayer(areaLayers);

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
			circle: false
		},

		edit: {
			remove: true,
			featureGroup: areaLayers
		}
	});
	map.addControl(drawControl);

// 1378x513 is the image
	var northEast = map.unproject(L.point(0,513), 20);
	var southWest = map.unproject(L.point(1378, 0), 20);

	var maxLatLngBounds = L.latLngBounds(southWest, northEast);

	L.tileLayer('map-tiles/{z}/map_tile_{x}_{y}.png', {
		minZoom: 18,
		maxZoom: 20,
		bounds: maxLatLngBounds
	}).addTo(map);

	map.setView(maxLatLngBounds.getCenter(), 20);

// listen to the draw created event
	map.on('draw:created', function(e) {
		var layer = e.layer;

		Areas.insert({
			title: $("#map-area-name").val(),
			color: $("#map-area-color").val(),
			latLngs: e.layer._latlngs[0]
		});

	});

// listen to the draw deleted event
	map.on('draw:deleted', function(e) {

		var allLayers = e.layers._layers;
		var key, id;

		for (key in allLayers) {
			id = allLayers[key]._leaflet_id;
			Areas.remove(id);
		}
	});


	map.on('draw:edited', function(e) {
		var key,val;

		for (key in e.layers._layers) {
			val = e.layers._layers[key];
			console.log(key);

			Areas.update(key, {$set: {
				latLngs: val._latlngs[0]
			}});

		}

	});

	var query = Areas.find();
	query.observe({

		added: function (newDocument) {
			polygon = L.polygon(newDocument.latLngs, { color: newDocument.color } );
			polygon._leaflet_id = newDocument._id;
			polygon.addTo(areaLayers);


			var area = L.GeometryUtil.geodesicArea(newDocument.latLngs);
			polygon.bindTooltip(newDocument.title + "<br />" + L.GeometryUtil.readableArea(area, true), {permanent: true, direction:"center", className: "no-tooltip"}).openTooltip();

		},

		removed: function (oldDocument) {
			layers = areaLayers._layers;
			var key, val;
			console.log(oldDocument);

			for (key in layers) {
				val = layers[key];

				if (val._leaflet_id == oldDocument._id) {
					areaLayers.removeLayer(val);
				}
			}
		},

		changed: function (newDocument, oldDocument) {
			layers = areaLayers._layers;
			var key, val;

			for (key in layers) {
				val = layers[key];

				if (val._leaflet_id == oldDocument._id) {
					areaLayers.removeLayer(val);
				}
			}

			console.log(newDocument);

			polygon = L.polygon(newDocument.latLngs, { color: newDocument.color } );
			polygon._leaflet_id = newDocument._id;
			polygon.addTo(areaLayers);

			var area = L.GeometryUtil.geodesicArea(newDocument.latLngs);
			polygon.bindTooltip(newDocument.title + "<br />" + L.GeometryUtil.readableArea(area, true), {permanent: true, direction:"center", className: "no-tooltip"}).openTooltip();
		}
 	});

};
