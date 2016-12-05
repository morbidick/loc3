Template.forkLayerPage.rendered = function () {

	Meteor.subscribe("Layers");
}

Template.forkLayerPage.events({
	'submit .fork-layer'(event) {
		// Prevent default browser form submit
		event.preventDefault();

		// Get value from form element
		var target = event.target;

		var old_id = target.old_id.value;
		var id = target.id.value;
		var title = target.title.value;

		Layers.insert({ _id: target.id.value, title: title });
		Areas.find({layer: old_id}).forEach(function (o) {

			delete o['_id'];
			o.layer = id;

			Areas.insert(o);

		});

		Router.go('mapPage');
		Flash.success("Layer succesfully forked!");

	},
});
