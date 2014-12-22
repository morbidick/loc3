Template.presentTransport.helpers({
	"fromdb": function () {
		console.log(name);
		var fromdb = Transports.findOne({"_id": this.name});
		console.log(fromdb);
		return fromdb;
	}
});