// Detailed item description helpers
Template.findPageId.helpers({
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

Template.findId.events({
  "submit form": function (event, template) {
    var itemId = template.$( '#queryId' ).val();
    try {
      validate.isEan8(itemId);
    }
    catch (error) {
      Flash.danger(error);
      return false;
    }
    Session.set("findById", itemId);
    Flash.clear();
    template.$( '#queryId' ).val("");
    template.$( '#queryId' ).focus();
    return false;
  }
});