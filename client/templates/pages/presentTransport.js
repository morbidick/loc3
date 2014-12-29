Template.presentTransport.helpers({
	"fromdb": function () {
		var fromdb = Transports.findOne({"_id": this.name});
		console.log(this.name);
		console.log(fromdb);
		return fromdb;
	}
});