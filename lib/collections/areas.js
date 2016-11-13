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
