Template.transportsPage.helpers({
	tableSettings: function () {
		return {
			collection: Transports,
			rowsPerPage: 50,
			showFilter: true,
			showColumnToggles: true,
			rowClass: function(item) { if (item.is_ccc) {return 'warning'}; },
			fields: [{
				key: 'name',
				label: "Name",
				hideToggle: true,
				sortOrder: 2,
			}, {
				key: 'vendor',
				label: "Vendor",
			}, {
				key: 'home',
				label: "Home",
				hidden: true,
			}, {
				key: 'shipper',
				label: "Shipper",
				hidden: true,
			}, {
				key: 'arrival',
				label: 'Arrival',
				fn: function (value, object) { return (value)? moment(value).format('DD.MM.YYYY HH:mm') : ""; },
				sortByValue: true,
				sortOrder: 0,
			}, {
				key: 'departure',
				label: 'Departure',
				fn: function (value, object) { return (value)? moment(value).format('DD.MM.YYYY HH:mm') : ""; },
				sortByValue: true,
				sortOrder: 1,
			}, {
				key: 'comment',
				label: "Comment",
				hidden: true,
			}, {
				key: 'file_ids',
				label: "Files",
				tmpl: Template.transportsTableFiles,
			}, {
				key: "modify",
				label: "",
				hideToggle: true,
				tmpl: Template.transportsTableModify,
				sortable: false,
			}]
		};
	}
});
