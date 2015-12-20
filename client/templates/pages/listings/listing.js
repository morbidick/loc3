Template.listingOverview.created = function() {
	Session.set("listingActive", "");
}

Template.listingOverview.helpers({
	"allListings": function() {
		Meteor.call("listingsDistinct", "name", 
			function(error, data) {
				if (error) {
        			Flash.danger(error);
        			window.scrollTo(0,0);
      			}
      			else {
      				Session.set("listingDescriptions", data);
      				return data;
      			}
			}
		);
		var descriptions = Session.get("listingDescriptions");
		return descriptions;
	}
});

Template.listingOverview.events({
	"change .listing-radio": function (event, template) {
		var value = event.target.value;
		Session.set("listingActive", value);
	}
});

Template.listingDetail.helpers({
	"listingItems": function() {
		var active = Session.get("listingActive");
		var items = [];
		console.log("active:_", active);
		console.log(Listings.find({"name": active}));
		Listings.find({"name": active}).forEach(
			function(doc) {
				var item = Items.findOne({"_id": doc.itemId});
				item.resolved = doc.resolved.toString();
				items.push(item);
			}
		);
		console.log("items: ", items[0]);
		return items;
	}
});

Template.listingDetail.events({

});