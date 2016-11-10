Areas = new Mongo.Collection('areas');

Areas.allow({
	insert: function (id, doc) {
		return true;
	},

	update: function (id, doc) {
		return true;
	},

	remove: function (id, doc) {
		return true;
	}
});
