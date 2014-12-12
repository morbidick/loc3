Template.presentValue.created = function () {
  this.editing = new ReactiveVar;
  this.editing.set(false);
}

Template.presentValue.helpers({
  "editing": function () {
    return Template.instance().editing.get();
  }
});

// Detailed item description events (editing)
Template.presentValue.events({
  "submit form": function (event, template) {
    var textF, text, newData, refId, dbName;
    textF = template.find( ".edit" );
    text = textF.value;
    dbName = this.dbName;
    refId = this.refId;
    newData = {};
    newData[dbName] = text;
    Items.update({_id: refId}, {$set: newData});
    template.editing.set(false);
    return false;
  },
  "click .toggleEdit": function(event, template) {
    var current = template.editing.get();
    template.editing.set(!current);
  }
});