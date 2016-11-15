require('leaflet-measure-path');
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

	L.Edit.PolyVerticesEdit.prototype['__initMarkers'] = L.Edit.PolyVerticesEdit.prototype['_initMarkers'];
	L.Edit.PolyVerticesEdit.prototype['__onMarkerDrag'] = L.Edit.PolyVerticesEdit.prototype['_onMarkerDrag'];

	L.Edit.PolyVerticesEdit.include({

		_initMarkers: function() {
			L.Edit.PolyVerticesEdit.prototype.__initMarkers.call(this);
			L.Edit.PolyVerticesEdit.prototype._createMoveMarker.call(this);
		},

		_createMoveMarker: function () {
			var center = this._poly.getCenter();
			this._moveMarker = this._createMarker(center, this.options.moveIcon);
		},

		_onMarkerDrag: function (e) {
			var marker = e.target,
				latlng = marker.getLatLng();

			if (marker === this._moveMarker) {
				this._move(latlng);
				this._poly.redraw();
				this._poly.fire('editdrag');
			} else {
				this.__onMarkerDrag(e);
			}

		},

		_move: function (newCenter) {
			var latlngs = this._poly.getLatLngs(),
				center = this._poly.getCenter(),
				offset, newLatLngs = [];

			// Offset the latlngs to the new center
			for (var j = 0, l2 = latlngs.length; j < l2; j++ ) {
				var polyLatLng = latlngs[j];
				var newPolyLatLngs = [];
				for (var i = 0, l = polyLatLng.length; i < l; i++) {
					offset = [polyLatLng[i].lat - center.lat, polyLatLng[i].lng - center.lng];
					newPolyLatLngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
				}
				newLatLngs.push(newPolyLatLngs);
			}

			this._poly.setLatLngs(newLatLngs);

			this._markerGroup.eachLayer(function (marker) {
				if (marker != this._moveMarker) {
					marker.remove();
				}
			}, this);
			this.__initMarkers();
			this._map.fire(L.Draw.Event.EDITMOVE, {layer: this._poly});
		},

	});

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

	L.tileLayer('map-tiles/{z}/tiles_{x}_{y}.png', {
		minZoom: 19,
		maxZoom: 22,
		maxNativeZoom: 20,
		bounds: maxLatLngBounds
	}).addTo(map);

	map.setView(maxLatLngBounds.getCenter(), 20);


	map.on('draw:created', function(e) {
		var layer = e.layer;

		Areas.insert({
			title: $("#map-area-name").val(),
			color: $("#map-area-color").val(),
			latLngs: e.layer._latlngs[0]
		});

	});


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
			polygon.addTo(areaLayers).showMeasurements();

			var area = L.GeometryUtil.geodesicArea(newDocument.latLngs);
			polygon.bindTooltip(newDocument.title, {permanent: true, offset: [0,20], direction:"center", className: "no-tooltip"}).openTooltip();
		},

		removed: function (oldDocument) {
			layers = areaLayers._layers;
			var key, val;
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

			polygon = L.polygon(newDocument.latLngs, { color: newDocument.color } );
			polygon._leaflet_id = newDocument._id;
			polygon.addTo(areaLayers).showMeasurements();

			polygon.bindTooltip(newDocument.title, {permanent: true, offset: [0,20], direction:"center", className: "no-tooltip"}).openTooltip();
		}
 	});

};
