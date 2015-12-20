Transports = new Mongo.Collection('transports');

Transports.allow({
	insert: function(userId, doc) {
		validate.authorized(Meteor.users.findOne(userId),"transport-add");
		return true;
	},
	update: function(userId, doc) {
		validate.authorized(Meteor.users.findOne(userId),"transport-update");
		return true;
	},
	remove: function(userId, doc) {
		validate.authorized(Meteor.users.findOne(userId),"transport-remove");
		return true;
	}
});


Transports.attachSchema(new SimpleSchema({
	name: {
		type: String,
		label: "Name",
		max: 50
	},
	prioritised: {
		type: Boolean,
		label: "Prioritised"
	},
	is_ccc: {
		type: Boolean,
		label: "is CCC"
	},
	arrival: {
		type: Date,
		optional: true,
		label: "Arrival time",
		autoform: {
			afFieldInput: {
				type: "bootstrap-datetimepicker"
			}
		}
	},
	departure: {
		type: Date,
		optional: true,
		label: "Departure time",
		autoform: {
			afFieldInput: {
				type: "bootstrap-datetimepicker"
			}
		}
	},
	vendor: {
		type: String,
		optional: true,
		label: "Vendor",
		max: 50
	},
	home: {
		type: String,
		optional: true,
		label: "Home",
		max: 50
	},
	shipper: {
		type: String,
		optional: true,
		label: "Shipper",
		max: 50
	},
	comment: {
		type: String,
		optional: true,
		label: "Brief summary",
	},
	file_ids: {
		type: [String],
		optional: true,
		label: "Files"
	},
	"file_ids.$": {
		type: [String],
		autoform: {
			afFieldInput: {
				label: "drag file here",
				type: 'fileUpload',
				collection: 'files'
			}
		}
	}
}));
