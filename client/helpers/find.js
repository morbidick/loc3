Template.searchForm.created = function () {
	Session.setDefault("searchResult", "");
};

Template.searchForm.events({
	"submit .searchForm": function() {
		var f = Items.findOne({name: {$text: this.value});
		Session.set("searchResult", JSON.stringify(f));
	}
});

Template.searchResult.helpers({
	"result": function() {

	}
});