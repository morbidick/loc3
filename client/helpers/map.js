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

	},

	MoveMarker: {
		init: function () {
			/*L.Edit.PolyVerticesEdit.prototype['__initMarkers'] = L.Edit.PolyVerticesEdit.prototype['_initMarkers'];
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

			})*/
		}
	}
}
