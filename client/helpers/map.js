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
