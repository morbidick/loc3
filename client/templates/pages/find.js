Template.searchForm.events({
  "submit .search": function (event) {
    var text = event.target.text.value;
    Session.set("search", text);
    event.target.text.value = "";
    return false;
  }
});

Template.searchResults.helpers({
	"results": function() {
		var searchTerm, results;
		searchTerm = Session.get("search");
		if (searchTerm !== undefined && searchTerm !== null && searchTerm !== "") {
			searchTerm = ".*" + searchTerm + ".*";
			results = Items.find({name: {$regex: searchTerm}}, {limit: 100});
			Session.set("resultQty", results.fetch().length);
			return results;
		}
	},

	"qty": function() {
		var resultQty = Session.get("resultQty");
		if((typeof resultQty) === "number" && resultQty > 0) {
			return resultQty + " results for: \"" + Session.get("search") + "\"";
		}
		else {
			return "no results";
		}
	}
});