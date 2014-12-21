Template.startPage.helpers({
  "info_url": Meteor.settings.public.info_url
})

Template.startPage.events({
	"click .clickme": function () {
		Meteor.call("correctUsers");
	}
});