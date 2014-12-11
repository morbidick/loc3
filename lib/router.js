Router.plugin('dataNotFound');
Router.plugin('loading');

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'noSuchId',
  loadingTemplate: 'loaad'
});

Router.route('/', {name: 'startPage'});

Router.route('/find/byId', {name: 'findPageId'});
Router.route('/find/full', {name: 'findPageFull'});
Router.route('/find/:_id', {
	name: 'findById',
	waitOn: function () {
		return Meteor.subscribe('items');
	},
	data: function () {
    	return Items.findOne({_id: this.params._id});
  	}
});
Router.route('/find', {name: 'findPage'});

Router.route('/scan/relocate', {name: 'relocatePage'});
Router.route('/scan/single', {name: 'singlePage'});
Router.route('/scan/bulk', {name: 'bulkPage'});
Router.route('/scan', {name: 'scanPage'});

Router.route('/transports', {name: 'transportsPage'});

Router.route('/maps', {name: 'mapsPage'});