Template.bulkPage.created = function () {
	//Keep our list of scans in this
	this.list = new ReactiveVar;
	this.list.set({});
}

Template.bulkPage.helpers({
	//Helpers concerned with listing scans
	"scanlist": function () {
		var list = Template.instance().list.get();
		var arr = $.map(list, function(el) { return el; });
		return arr;
	},
	//BEWARE! call with scan item as context!
	"style": function () {
		if (this.valid) {
			return "success";
		}
		if (this.overwrite) {
			return "warning";
		}
		return "danger";
	},
	"listhandle": function () {
		return Template.instance().list;
	},

	//Helpers concerned with displaying the form
	"itemlist": function () {
		var list = Template.instance().list.get();
		return list;
	}
});

Template.bulkPage.events({
	"submit .scan": function (event, template) {
		var scan, db, item, current;
		event.stopPropagation();
		event.preventDefault();
		scan = template.$( '.scan-input' ).val();
		if (/^\d{8}$/.test(scan)) {
			db = Items.findOne({_id: scan});
			if (db) {
				item = {_id: scan, name: db.name, valid: false, overwrite: false};
			}
			else {
				item = {_id: scan, name: "new", valid: true, overwrite: true};
			}
			current = template.list.get();
			current[scan] = item;
			template.list.set(current);
		}
		else {
			Flash.danger("scan invalid - " + scan + " has faulty length");
		}
		template.$( '.scan-input' ).val("");
		template.$( '.scan-input' ).focus();
		return false;
	},
	"click .remove": function (event, template) {
		relatedId = event.target.attributes.relatedId.value;
		var current = template.list.get();
		delete current[relatedId];
		template.list.set(current);
		return false;
	},
	"click .overwrite": function (event, template) {
		relatedId = event.target.attributes.relatedId.value;
		var current = template.list.get();
		current[relatedId].overwrite = !current[relatedId].overwrite;
		template.list.set(current);
		return false;
	}
});

Template.bulkForm.created = function () {
	this.main = new ReactiveVar;
	this.main.set(null);
	this.sub = new ReactiveVar;
	this.sub.set(null);
};

Template.bulkForm.helpers({
  "main": function () {
    return Template.instance().main.get();
  },
  "hasSublocation": function () {
  	var main = Template.instance().main.get();
  	if (!main) {
  		return false;
  	}
  	var fromdb = Locations.findOne({_id: main});
  	if (fromdb && fromdb.sublocations) {
  		return true;
  	}
  	return false;
  }
});

Template.bulkForm.events({
	"click .submit": function (event, template) {
		var name, team, vendor, comment, transport, location;
		var radio, itemData, usr;
		var handle = this.handle;

		name = template.$( '#submissionName' ).val();
		team = template.$( '.team-select option:selected' ).val();
		vendor = template.$( '#submissionVendor' ).val();
		comment = template.$( '#submissionComment' ).val();
		transport = template.$( '.transport-select option:selected' ).val();
		location = {	"main": template.main.get(),
						"sub": template.sub.get() };
		itemData = {"name": name,
					"team": team,
					"vendor": vendor,
					"transport": transport,
					"location": location,
					"past_locations": [],
					"comment": comment };
		var submittedIds = [];
		var id;
		for(id in this.items) {
			if(this.items[id].valid || this.items[id].overwrite) {
				submittedIds.push(id);
			}
		}
		Meteor.call("addItems", submittedIds, itemData, function (error, data) {
			if (error) {
				template.$( '#submissionName' ).val("");
				Flash.danger(error);
				window.scrollTo(0,0);
			}
			else {
				Flash.clear();
				handle.set({});
				template.$( '#submissionName' ).val("");
				window.scrollTo(0,0);				
			}
		});

		return false;
	},

	"change [name='locGroup']": function (event, template) {
		// var radio = template.$( ':checked' ).filter( ':radio' ).filter( '[name="locGroup"]' );
		template.sub.set(null);
		template.main.set(event.target.value);
	},

	"change [name='subLocGroup']": function (event, template) {
		// var radio = template.$( ':checked' ).filter( ':radio' ).filter( '[name="subLocGroup"]' );
		template.sub.set(event.target.value);
	},  
});
