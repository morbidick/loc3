Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {name: 'startPage'});
Router.route('/find', {name: 'findPage'});
Router.route('/scan', {name: 'scanPage'});
Router.route('/maps', {name: 'mapsPage'});
