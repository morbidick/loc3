Template.generatePage.created = function(){
  this.result = new ReactiveVar();
  this.result.set([]);
}

Template.generatePage.helpers({
  "result": function () {
    return Template.instance().result.get();
  }
})

Template.generatePage.events({
  "submit form": function(event,template) {
    var start = template.$('#start').val();
    var end = template.$('#end').val();
    var result = template.result.get();
    for (var i = start; i <= end; i++) {
      code = ean8.create(i);
      result.push(code);
    }
    template.result.set(result);
    return false;
  }
})
