AutoForm.addHooks("layerForm", {
  after: {
	  insert: function(error, result, template) {
		  if(error) {
			  Flash.danger(error);
		  } else {
			  Router.go('layerPage');
			  Flash.success("Layer succesfully added!");
		  }
	  },
	  update: function(error, result, template) {
      if(error) {
        Flash.danger(error);
      } else {
        Router.go('layerPage');
        Flash.success("Layer succesfully updated!");
      }
    }
  }
});
