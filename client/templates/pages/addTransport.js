Template.addTransportPage.events({
  "submit form": function(event,template) {
    transport = {
      "name": template.$('#name').val(),
      "prioritised": template.$('#prioritised').is(':checked'),
      "arrival_date": template.$('#arrival_date').val(),
      "arrival_time": template.$('#arrival_time').val(),
      "departure_date": template.$('#departure_date').val(),
      "departure_time": template.$('#departure_time').val(),
      "shipper": template.$('#shipper').val(),
      "home": template.$('#home').val(),
      "is_ccc": template.$('#isCCC').is(':checked'),
      "vendor": template.$('#vendor').val(),
      "comment": template.$('#comment').val(),
      "files": template.$('#files').val()
    };
    Meteor.call("addTransport", transport, function(error, data) {
      if(error) {
        Flash.danger(error);
      } else {
        Router.go('transportsPage');
        Flash.success(data.name + " succesfully added!");
      }
    });
    return false;
  }
});
