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
