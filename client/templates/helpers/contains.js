UI.registerHelper('contains', function(value,list,options) {
  if(_.contains(list, value)) {
    return this;
  } else {
    return null;
  }
});
