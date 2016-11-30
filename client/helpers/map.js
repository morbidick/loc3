require('leaflet-measure-path');
require('leaflet-draw-drag');
import "leaflet-measure-path/leaflet-measure-path.css";

LeafletMap = function(divId, dataLayers) {
	this.divId = divId;
	this.dataLayers = dataLayers;


	this.map;
	this.drawControl;
	this.currentLayer = null;
	this.currentDataLayer = null;
	this._inDeleteMode = false;

	this.init();
};

LeafletMap.prototype.init = function () {

	this.map = L.map(this.divId, {
		crs: L.CRS.Simple,
		minZoom: 19,
		maxZoom: 22,
	});

	this.map.on('baselayerchange', $.proxy(function(e) {
		this.switchLayer(e.layer);

		var layers = e.layer._layers;
		for (key in layers) {
			val = layers[key];
			val.redraw();
			val.showMeasurements();
		}
	}, this));



	var layers = {};
	for (key in this.dataLayers) {
		value = this.dataLayers[key];
		layers[value.name] = value.featureGroup;
	}
	L.control.layers(layers).addTo(this.map);
	var defaultLayer = layers[Object.keys(layers)[0]];
	this.switchLayer(defaultLayer);

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


	this.map.on('draw:created', $.proxy(this.DrawEventHandler.drawCreated, this));
	this.map.on('draw:deleted', $.proxy(this.DrawEventHandler.drawDeleted, this));
	this.map.on('draw:edited', $.proxy(this.DrawEventHandler.drawEdited, this));
	this.map.on('draw:deletestart', $.proxy(function(e) {
		this._inDeleteMode = true;
	}, this));
	this.map.on('draw:deletestop', $.proxy(function(e) {
		this._inDeleteMode = false;
	}, this));

	for (key in this.dataLayers) {
		value = this.dataLayers[key];
		value.bindToData(this);
	}


}

LeafletMap.prototype.switchLayer = function (layer) {
	this.currentLayer = layer;
	this.currentDataLayer = this.determineDataLayer(layer);

	this.map.addLayer(layer)
	this.drawEditControl(layer);
}

LeafletMap.prototype.determineDataLayer = function (layer) {

	for (key in this.dataLayers) {
		value = this.dataLayers[key];

		if (value.featureGroup == layer) {
			return value;
		}
	}
	return null;
}

LeafletMap.prototype.drawEditControl = function(editLayer) {
	if (Roles.userIsInRole(Meteor.userId(), ['areas-editor'])) {

		if (this.drawControl != null) this.map.removeControl(this.drawControl);

		this.drawControl = new L.Control.Draw({
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
				featureGroup: editLayer,
				edit: {
					moveMarkers: true,
					selectedPathOptions: {
						maintainColor: true
					}
				}
			}
		});
		this.map.addControl(this.drawControl);
	}
}


LeafletMap.prototype.drawArea = function(areaDocument, areaLayer) {
	polygon = L.polygon(areaDocument.latLngs, { color: areaDocument.color } );
	polygon._leaflet_id = areaDocument._id;
	polygon.addTo(areaLayer).showMeasurements();

	polygon.on("click", $.proxy(function(e) {
		console.log(this);
		console.log(e);
		if (e.target.editing._enabled != true && !this._inDeleteMode) {
			Router.go('editAreaPage', { _id: e.target._leaflet_id });
		}
	}, this));

	var tooltip = polygon.bindTooltip(areaDocument.title, {permanent: true, offset: [0,20], direction:"center", className: "no-tooltip"});

}

LeafletMap.prototype.removeArea = function(areaDocument, areaLayer) {
	layers = areaLayer._layers;
	var key, val;

	for (key in layers) {
		val = layers[key];

		if (val._leaflet_id == areaDocument._id) {
			areaLayer.removeLayer(val);
		}
	}
}


LeafletMap.prototype.DrawEventHandler = {
	/**
	 *
	 * @param e
	 */
	drawCreated: function (e) {
		console.log(this.currentDataLayer);

		var layer = e.layer;
		var latLngs = MapHelper.LatLngUtil.latLngsToObjectArray(layer._latlngs[0]);

		 this.currentDataLayer.handleDrawCreated({
		 	latLngs: latLngs
		 });
	},

	/**
	 *
	 * @param e
	 */
	drawEdited: function (e) {
		var key, val, latLngs;

		for (key in e.layers._layers) {
			val = e.layers._layers[key];
			latLngs = MapHelper.LatLngUtil.latLngsToObjectArray(val._latlngs[0]);

			this.currentDataLayer.handleDrawEdited(key, {
				latLngs: latLngs
			});

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
			this.currentDataLayer.handleDrawDeleted(id);
		}
	},
}



LeafletDataLayer = function(name, layerName) {
	this.name = name;
	this.layerName = layerName;
	this.leafletMap;
	this.featureGroup;
	this.init();
}

LeafletDataLayer.prototype.init = function() {
	this.featureGroup = new L.FeatureGroup();
}

LeafletDataLayer.prototype.bindToData = function(leafletMap) {
	this.leafletMap = leafletMap;

	Areas.find({ layer: this.layerName }).observe({
		_self: this,
		added: function (newDocument) {
			var self = this._self;
			self.leafletMap.drawArea(newDocument, self.featureGroup);
		},
		removed: function (oldDocument) {
			var self = this._self;
			self.leafletMap.removeArea(oldDocument, self.featureGroup);
		},
		changed: function (newDocument, oldDocument) {
			var self = this._self;
			self.leafletMap.removeArea(oldDocument, self.featureGroup);
			self.leafletMap.drawArea(newDocument, self.featureGroup);
		}
	});
}

LeafletDataLayer.prototype.handleDrawCreated = function (document) {
	$.extend(document, { layer: this.layerName });
	return Areas.insert(document);
}

LeafletDataLayer.prototype.handleDrawEdited = function (id, document) {
	$.extend(document, { layer: this.layerName });
	return Areas.update(id, {
		$set: document
	});
}

LeafletDataLayer.prototype.handleDrawDeleted = function (id) {
	return Areas.remove(id);
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
	}
}
