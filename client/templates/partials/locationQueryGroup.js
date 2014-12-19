Template.locationQueryGroup.created = function () {
	this.locationState = new ReactiveVar();
	this.locationState.set({});
}

Template.locationQueryGroup.helpers({
	"mains": function () {
		var locations = Locations.find().fetch();
		return locations;
	},
	"hasAdditional": function () {
		return false;
	},
	"additionalFields": function () {
		return [];
	},
	"hasSublocations": function () {
		var fromdb = Locations.findOne({_id: this._id});
		console.log(fromdb);
		if (!fromdb) {
			return false;
		}
		return !!(fromdb.sublocations);
	},
	"sublocations": function () {
		var fromdb = Locations.findOne({_id: this._id});
		console.log("sublocations");
		if (!fromdb) {
			return false;
		}
		var sublocations = fromdb.sublocations;
		var arr = $.map(sublocations, function(el) { return el; });
		return arr;	
	}
});

Template.locationQueryGroup.events({
	"change .location-checkbox": function (event, template) {
		if (event.target.checked) {
			if (!template.locationState[event.target.value]) {
				template.locationState[event.target.value] = {main: true};
			}
			else template.locationState[event.target.value].main = true
		}
		else {
			if (!template.locationState[event.target.value]) {
				template.locationState[event.target.value] = {main: false};
			}
			else template.locationState[event.target.value].main = false
		}
	},
	"change .sublocation-checkbox": function (event, template) {
		console.log(event.target.checked);
		console.log(event.target.value);
		console.log(event.target.main);
	}
});