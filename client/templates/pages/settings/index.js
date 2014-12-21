Template.settingsPage.helpers({
  "roles": function () {
    return Roles.getAllRoles();
  },
  "users": function() {
    return Meteor.users.find({}, {fields: {_id: 1, username: 1, roles:1}});
  }
})
Template.settingsPage.events({
  "change .permission-toggle": function (event, template) {
    if(event.target.checked) {
      Meteor.call("addUserToRole", $(event.target).attr("userId"), $(event.target).attr("role"), function(error,data) {
        if(error) {
          Flash.danger(error);
          event.target.checked = !event.target.checked;
        } else {
          Flash.success("permission updated!")
        }
      });
    } else {
      Meteor.call("remUserFromRole", $(event.target).attr("userId"), $(event.target).attr("role"), function(error,data) {
        if(error) {
          Flash.danger(error);
          event.target.checked = !event.target.checked;
        } else {
          Flash.success("permission updated!")
        }
      });
    }
  }
})
