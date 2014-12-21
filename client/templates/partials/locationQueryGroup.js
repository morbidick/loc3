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
		var state = Template.instance().locationState.get();
		var fromdb = Locations.findOne({_id: this._id});
		if (state[this._id] && state[this._id].main) {
			if (!fromdb) {
				return false;
			}
			return !!(fromdb.sublocations);
		}
		return false;
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
		var check = event.target.checked;
		var value = event.target.value;
		if (check) {
			var locationState = template.locationState.get();
			if (!locationState[value]) {
				locationState[value] = {main: true};
				template.locationState.set(locationState);
			}
			else {
				locationState[value].main = true;
				template.locationState.set(locationState);
			}
		}
		else {
			var locationState = template.locationState.get();
			if (!locationState[value]) {
				locationState[value] = {main: false};
				template.locationState.set(locationState);
			}
			else {
				locationState[value].main = false;
				template.locationState.set(locationState);
			}
		}
		console.log(template.locationState.get());
	},
	"change .sublocation-checkbox": function (event, template) {
		var sub = event.target.value;
		var main = this.main;
		var checked = event.target.checked;
		var locationState = template.locationState.get();
		if (event.target.checked) {
			locationState[main].main = true;
			locationState[main][sub] = true;
			template.locationState.set(locationState);
		}
		else {
			// locationState[main].main = true;
			locationState[main][sub] = false;
			template.locationState.set(locationState);			
		}
	}
});