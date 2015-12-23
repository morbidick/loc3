Template.teamsPage.helpers({
	tableSettings: function () {
		return {
			collection: Teams,
			rowsPerPage: 50,
			showFilter: true,
			showColumnToggles: true,
			fields: [{
				key: "_id",
				label: "Name",
				hideToggle: true,
				sortOrder: 0,
			}, {
				key: "primary_phone_number",
				label:  "Phone"
			}, {
				key: 'comment',
				label: "Comment",
				tmpl: Template.teamsTableComment,
			}, {
				key: "modify",
				label: "",
				hideToggle: true,
				tmpl: Template.teamsTableModify,
				sortable: false,
			}],
		};
	}
});
