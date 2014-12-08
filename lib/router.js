Router.plugin('dataNotFound');
Router.plugin('loading');

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'noSuchId',
  loadingTemplate: 'loaad'
});

Router.route('/find/:_id', {
	name: 'findById',
	waitOn: function () {
		return Meteor.subscribe('items');
	},
	data: function () {
    	return Items.findOne({_id: this.params._id});
  	}
});

Router.route('/', {name: 'startPage'});
Router.route('/find', {name: 'findPage'});
Router.route('/scan', {name: 'scanPage'});
Router.route('/maps', {name: 'mapsPage'});
