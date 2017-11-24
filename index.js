var fs = require('fs');
var path = require('path');
exports.adapter = {
	isTag: function () { return true; },
	getName: function (node) {
		return fs.statSync(node.path).isDirectory() ?
			'directory' : 'file';
	},
	getChildren: function (node) {
		return fs.statSync(node.path).isDirectory() ? fs.readdirSync(node.path).map(function (file) {
			return { path: path.join(node.path, file), parent: node };
		}) : [];
	},
	getParent: function (node) {
		return node.parent;
	},
	hasAttrib: function (element, name) {
		return true;
	},
	getAttributeValue: function (element, name) {
		switch (name) {
			case 'name':
				return path.basename(element.path);
			case 'ext':
				return path.extname(element.path);
		}
	},
	findAll: function (test, nodes) {
		var $this = this;
		var all = [];
		function find(nodes) {
			for (var i in nodes) {
				var child = nodes[i];
				find($this.getChildren(child));
				if (test(child))
					all.push(child);
			};
		}
		find(nodes);
		return all;
	},
	equals: function (n, m) {
		return n.path == m.path;
	}
};
exports.Element = function (path) { return { path: path }; };
