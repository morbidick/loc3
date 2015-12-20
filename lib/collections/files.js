Files = new FS.Collection("files", {
	stores: [new FS.Store.GridFS("filesStore")]
});

Files.allow({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	download: function () {
		return true;
	},
	fetch: null
});
