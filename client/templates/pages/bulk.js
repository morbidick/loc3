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
		var usr, scan, db, item, current;

		usr = Meteor.userId();
		if (!usr) {
			console.log("pls log in to scan");
			return false;
		}
		scan = template.$( '#bScan' ).val();
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
			template.$( '#bScan' ).val("");
		}
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
  "locationIs": function (location) {
    var current = Template.instance().main.get();
    return location === current;
  },
  "locationSubdivided": function (location) {
    if (!location) {
      return false;
    }
    var sublocations = Meteor.settings.public.sublocations; 
    if (sublocations[location]) {
      return true;
    }
    return false;  
  }
});

Template.bulkForm.events({
	"click .submit": function (event, template) {
		var name, team, vendor, comment, transport, location;
		var radio, itemData, usr;

		usr = Meteor.user();
		if(!usr) {
			//how did you even get here somethingsomething
			console.log("please log in to scan")
			return false;
		}
		name = template.$( '#submissionName' ).val();
		team = template.$( '#submissionTeam' ).val();
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
				Flash.danger(error);
			}
		});

		template.$( '#submissionName' ).val("");

		return false;
	},

	"change [name='locGroup']": function (event, template) {
		var radio = template.$( ':checked' ).filter( ':radio' ).filter( '[name="locGroup"]' );
		template.sub.set(null);
		template.main.set(radio.val());
	},

	"change [name='subLocGroup']": function (event, template) {
		var radio = template.$( ':checked' ).filter( ':radio' ).filter( '[name="subLocGroup"]' );
		template.sub.set(radio.val());
	},  
});
