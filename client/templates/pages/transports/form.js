'use strict';

AutoForm.addHooks("transportForm", {
  after: {
    insert: function(error, result, template) {
      if(error) {
        Flash.danger(error);
      } else {
        Router.go('transportsPage');
        Flash.success("Transport succesfully added!");
      }
    },
    update: function(error, result, template) {}
  }
});
