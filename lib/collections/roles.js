if(Meteor.isServer && (Roles.getAllRoles().fetch().length !== Meteor.settings.roles.length)) {
  Meteor.startup(function () {
    Meteor.roles.remove({});
    _.each(Meteor.settings.roles,
      function(role) {
        Roles.createRole(role);
      }
    );
  });
}

Meteor.methods({
  "addUserToRole": function (user_id, role) {
    validate.authorized(Meteor.user(), "admin");
    var user = Meteor.users.findOne(user_id);
    Roles.addUsersToRoles(user, role)
  },
  "remUserFromRole": function (user_id, role) {
    validate.authorized(Meteor.user(), "admin");
    var user = Meteor.users.findOne(user_id);
    Roles.removeUsersFromRoles(user,role)
  },
	"getRolesForUser": function (user_id, group) {
		return Roles.getRolesForUser(user_id, group);
	},

	"userIsInRole": function (user_id, roles, group) {
		return Roles.userIsInRole(user_id, roles, group);
	}
})
