Template.submissionGroup.helpers({
  "computedType": function() {
    var type = this.type || "Text";
    return "submissionGroup" + type;
  }
})
