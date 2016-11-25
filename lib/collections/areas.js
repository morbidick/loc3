Areas = new Mongo.Collection('areas');

Areas.allow({
	insert: function (id, doc) {
		return validate.authorized(Meteor.users.findOne(id),"areas-editor");
	},

	update: function (id, doc) {
		return validate.authorized(Meteor.users.findOne(id),"areas-editor");
	},

	remove: function (id, doc) {
		return validate.authorized(Meteor.users.findOne(id),"areas-editor");
	}
});


Areas.attachSchema(new SimpleSchema({
	"_id": {
		type: String,
		label: "ID",
		max: 50
	},

	"title": {
		type: String,
		optional: false,
		label: "Title",
		defaultValue: "Label"
	},
	"color": {
		type: String,
		label: "Color",
		defaultValue: "#ff0000",
		regEx: /^\#[a-f0-9A-F]{6}$/,
	},

	"latLngs.$": {
		label: "LatitudeLongitude"
	},

	"latLngs.$.lat": {
		type: String,
		label: "Lat"
	},

	"latLngs.$.lng": {
		type: String,
		label: "Lng"
	},

	"locationId": {
		type: String,
		optional: true
	}

}));
