Template.addTeamPage.events({
  "submit form": function(event,template) {
    team = {
      "_id": template.$('#name').val(),
      "primary_phone_number": template.$('#primary_phone_number').val(),
      "comment": template.$('#comment').val()
    };
    Meteor.call("addTeam", team, function(error, data) {
      if(error) {
        Flash.danger(error);
      } else {
        Router.go('teamsPage');
        Flash.success(data.name + " succesfully added!");
      }
    });
    return false;
  }
});
