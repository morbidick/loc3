Template.layerPage.helpers({
	tableSettings: function () {
		return {
			collection: Layers,
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
			}, /*{
				key: 'comment',
				label: "Comment",
				tmpl: Template.teamsTableComment,
			},*/ {
				key: "modify",
				label: "",
				hideToggle: true,
				tmpl: Template.layerTableModify,
				sortable: false,
			}],
		};
	}
});
