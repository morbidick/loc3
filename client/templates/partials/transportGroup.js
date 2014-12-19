Template.transportGroup.helpers({
	"registeredTransports": function () {
		var transports = Transports.find({}).fetch();
		transports.unshift({_id: ""});
		return transports;
	}
});