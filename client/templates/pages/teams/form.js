AutoForm.addHooks("teamForm", {
  after: {
    insert: function(error, result, template) {
      if(error) {
        Flash.danger(error);
      } else {
        Router.go('teamsPage');
        Flash.success("Team succesfully added!");
      }
    },
    update: function(error, result, template) {
      if(error) {
        Flash.danger(error);
      } else {
        Router.go('teamsPage');
        Flash.success("Team succesfully up!");
      }
    }
  }
});
