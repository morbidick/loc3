Meteor.methods({
  logCommand: function (thing) {
    console.log(thing);
  },

  registerItem: function (user, itemId, name, location, team, vendor, comment) {
  	var item = {};
  	var date = new Date();

  	// check user privileges
  	// check if item exists
  	// check location
  	
  	item._id = itemId;
  	item.name = name;
  	item.created_at = date;
  	location.timestamp = date;

  }
});

var validateLocation = function (main, sub) {
	if (!Meteor.settings.public.locations.main) {
		return false;
	}
	if (!Meteor.settings.public.sublocations.main.sub) {
		return false;
	}
	return true;
};