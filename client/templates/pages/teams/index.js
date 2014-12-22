Template.teamsPage.helpers({
  "teams": function() {
    return Teams.find().fetch();
  } 
});
