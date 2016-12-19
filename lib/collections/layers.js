Layers = new Mongo.Collection('layers');

Layers.allow({
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


Layers.attachSchema(new SimpleSchema({
	"_id": {
		type: String,
		label: "ID",
		max: 50,
		unique: true,
	},

	"title": {
		type: String,
		optional: false,
		label: "Title",
		defaultValue: "Label",
		unique: true,
	}
}));

Layers.after.remove(function (userId, doc) {
	Areas.find({ layer: doc._id }).forEach(function (o) {
		Areas.remove({ _id: o._id });
	});
});

// Create default layer
if(Meteor.isServer && Layers.find().fetch().length === 0 ) {
	Layers.insert({
		_id: "default",
		title: "default"
	});
}
