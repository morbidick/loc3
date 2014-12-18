Router.plugin('dataNotFound');
Router.plugin('loading');

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'noSuchId',
  loadingTemplate: 'loading',
  waitOn: function () {
    return [Meteor.subscribe('items'),Meteor.subscribe('locations'),Meteor.subscribe('userData')];
  }
});

Router.route('/', {name: 'startPage'});

Router.route('/find/byId', {name: 'findPageId'});
Router.route('/find/full', {name: 'findPageFull'});
Router.route('/find/:_id', {
	name: 'findById',
	data: function () {
    return Items.findOne({_id: this.params._id});
  }
});
Router.route('/find', {name: 'findPage'});

Router.route('/scan/relocate', {name: 'relocatePage'});
Router.route('/scan/single', {name: 'singlePage'});
Router.route('/scan/bulk', {name: 'bulkPage'});
Router.route('/scan', {name: 'scanPage'});

Router.route('/transports/add', {name: 'addTransportPage'})
Router.route('/transports', {
  name: 'transportsPage',
  waitOn: function () {
    return Meteor.subscribe('transports');
  }
});

Router.route('/maps', {name: 'mapsPage'});
Router.route('/generate', {name: 'generatePage'});
Router.route('/teams/add', {name: 'addTeamPage'})
Router.route('/teams', {
  name: 'teamsPage',
  waitOn: function () {
    return Meteor.subscribe('teams');
  }
});
