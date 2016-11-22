Template.areasPage.helpers({
	tableSettings: function () {
		return {
			collection: Areas,
			rowsPerPage: 50,
			showFilter: true,
			showColumnToggles: true,
			fields: [{
				key: "_id",
				label: "ID",
				hideToggle: true,
				sortOrder: 0,
			}, {
				key: "title",
				label: "Title",
			}, {
				key: "color",
				label: "Color",
			}, /*{
				key: 'comment',
				label: "Comment",
				tmpl: Template.teamsTableComment,
			},*/ {
				key: "modify",
				label: "",
				hideToggle: true,
				tmpl: Template.areasTableModify,
				sortable: false,
			}],
		};
	}
});
