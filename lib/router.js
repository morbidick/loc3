Router.plugin('dataNotFound');
Router.plugin('loading');

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'noSuchId',
  loadingTemplate: 'loading',
  waitOn: function () {
    return [Meteor.subscribe('items'),Meteor.subscribe('locations'),Meteor.subscribe('userData'),Meteor.subscribe('teams'),Meteor.subscribe('transports')];
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
Router.route('/scan/bulk', {name: 'bulkPage'});
Router.route('/scan', {name: 'scanPage'});

Router.route('/transports', {name: 'transportsPage'});
Router.route('/transports/add', {name: 'addTransportPage'})
Router.route('/transports/:_id', {
  name: 'editTransportPage',
  data: function () {
    return Transports.findOne({_id: this.params._id});
  }
});

Router.route('/map', {name: 'mapPage'});

Router.route('/teams', {name: 'teamsPage'});
Router.route('/teams/add', {name: 'addTeamPage'})
Router.route('/teams/:_id', {
  name: 'editTeamPage',
  data: function () {
    return Teams.findOne({_id: this.params._id});
  }
});

Router.route('/settings', {name: 'settingsPage'});
