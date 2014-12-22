Template.findPageId.rendered = function () {
  template.$( '#queryId' ).focus();
}

// Detailed item description helpers
Template.findPageId.helpers({
  // Get a single doc from our db referred 
  "fromdb": function() {
    var itemId, data;
    itemId = Session.get("findById");
    if (!itemId) {
      return {found: false};
    }
    data = Items.findOne({"_id": itemId});
    if (!data) {
      return {found: false};
    }
    return {found: true, data: data};
  }
});

// Find by id events
Template.findId.events({
  "submit form": function (event, template) {
    var itemId = template.$( '#queryId' ).val();
    // TODO update this to use a global and more specific query
    if ( /^\d{8}$/.test(itemId) ) {
      Session.set("findById", itemId);
      Flash.clear();
    }
    else {
      Flash.danger("Invalid scan");
    }
    template.$( '#queryId' ).val("");
    template.$( '#queryId' ).focus();
    // prevent default
    return false;
  }
});
