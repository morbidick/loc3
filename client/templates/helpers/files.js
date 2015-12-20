UI.registerHelper('files', function() {
	var ids = [].concat(this.file_ids);
	return Files.find({"_id": {"$in": ids }});
});
