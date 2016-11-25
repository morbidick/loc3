require('leaflet-measure-path');
require('leaflet-draw-drag');
import "leaflet-measure-path/leaflet-measure-path.css";

LeafletMap = function(divId) {
	var map;
	var areaLayers;

	this.init(divId);
};

LeafletMap.prototype.init = function (divId) {
	this.map = L.map(divId, {
		crs: L.CRS.Simple,
		minZoom: 19,
		maxZoom: 22,
	});

	this.areaLayers = new L.FeatureGroup();
	this.map.addLayer(this.areaLayers);


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
				featureGroup: this.areaLayers,
				edit: {
					moveMarkers: true,
					selectedPathOptions: {
						maintainColor: true
					}
				}
			}
		});
		this.map.addControl(drawControl);
	}

	var northEast = this.map.unproject(L.point(0,599), 20);
	var southWest = this.map.unproject(L.point(1506, 0), 20);

	var maxLatLngBounds = L.latLngBounds(southWest, northEast);

	var hall_h = L.tileLayer('map-tiles/{z}/tiles_{x}_{y}.png', {
			minZoom: 19,
			maxZoom: 22,
			maxNativeZoom: 20,
			bounds: maxLatLngBounds
	}).addTo(this.map);

	this.map.setView(maxLatLngBounds.getCenter(), 20);


	this.map.on('draw:created', MapHelper.DrawEventHandler.drawCreated);
	this.map.on('draw:deleted', MapHelper.DrawEventHandler.drawDeleted);
	this.map.on('draw:edited', MapHelper.DrawEventHandler.drawEdited);

	var query = Areas.find();

	query.observe({
		_self: this,
		added: function (newDocument) {
			var self = this._self;
			console.log(self);
			self.drawArea(newDocument);
		},
		removed: function (oldDocument) {
			var self = this._self;
			self.removeArea(oldDocument);
		},
		changed: function (newDocument, oldDocument) {
			var self = this._self;
			self.removeArea(oldDocument);
			self.drawArea(newDocument);
		}
	});
}


LeafletMap.prototype.drawArea = function(areaDocument) {
	polygon = L.polygon(areaDocument.latLngs, { color: areaDocument.color } );
	polygon._leaflet_id = areaDocument._id;
	polygon.addTo(this.areaLayers).showMeasurements();

	polygon.on("click", function(e) {
		console.log(e);
		//if (e.target.editing._enabled != true && drawControl._toolbars.edit._modes.remove.handler._enabled) {
		//	Router.go('editAreaPage', { _id: e.target._leaflet_id });
		//}
	});

	var tooltip = polygon.bindTooltip(areaDocument.title, {permanent: true, offset: [0,20], direction:"center", className: "no-tooltip"}).openTooltip();

}

LeafletMap.prototype.removeArea = function(areaDocument) {
	layers = this.areaLayers._layers;
	var key, val;

	for (key in layers) {
		val = layers[key];

		if (val._leaflet_id == areaDocument._id) {
			this.areaLayers.removeLayer(val);
		}
	}
}


MapHelper = {

	LatLngUtil: {
		latLngsToObjectArray: function(latLngs) {
			var latLngsArray = [];

			latLngs.forEach(function (o) {
				latLngsArray.push({lat: o.lat, lng: o.lng});
			});

			return latLngsArray;
		}
	},

	DrawEventHandler: {
		/**
		 *
		 * @param e
		 */
		drawCreated: function (e) {
			var layer = e.layer;
			var latLngs = MapHelper.LatLngUtil.latLngsToObjectArray(layer._latlngs[0]);

			Areas.insert({
				latLngs: latLngs,
			});
		},


		/**
		 *
		 * @param e
		 */
		drawEdited: function (e) {
			var key,val,latLngs;

			for (key in e.layers._layers) {
				val = e.layers._layers[key];
				latLngs = MapHelper.LatLngUtil.latLngsToObjectArray(val._latlngs[0]);

				Areas.update(key, {$set: {
					latLngs: latLngs
				}});

			}
		},

		/**
		 *
		 * @param e
		 */
		drawDeleted: function (e) {
			var allLayers = e.layers._layers;
			var key, id;

			for (key in allLayers) {
				id = allLayers[key]._leaflet_id;
				Areas.remove(id);
			}
		}

	}
}
