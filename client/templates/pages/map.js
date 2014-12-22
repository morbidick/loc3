Template.mapPage.helpers({
  "map_file": Meteor.settings.public.map_file
})
Template.mapPage.rendered = function() {
  if(Meteor.settings.public.map_deprecated === true) {
    Flash.warning("Warning: This plan may be deprecated");
  }
}
