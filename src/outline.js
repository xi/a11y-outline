var aria = require('aria-api');
var treeview = require('./treeview');

var createDialog = function() {
	var dialog = document.createElement('dialog');
	dialog.addEventListener('close', function() {
		dialog.remove();
	});
	dialog.style = 'max-width: 90vw; max-height: 90vh; overflow: auto;';
	document.body.appendChild(dialog);
	return dialog;
};

var createItem = function(el, i) {
	var label = aria.getRole(el);
	var name = aria.getName(el, null, true);
	if (name) {
		label = name + ' ' + label;
	}

	return {
		label: label,
		description: aria.getDescription(el),
		href: '#' + i
	};
};

var focus = function(el) {
	el.focus();
	if (document.activeElement !== el) {
		el.tabIndex = -1;
		el.focus();
	}
};

var buildTree = function(role, dialog) {
	var matches = aria.querySelectorAll(document, role)
		.filter(function(el) {
			return !aria.matches(el, ':hidden');
		});

	var items = Array.prototype.map.call(matches, createItem);
	var tree = treeview(items, role);

	tree.addEventListener('click', function(event) {
		if (event.target.matches('a')) {
			event.preventDefault();
			dialog.close();

			var href = event.target.getAttribute('href');
			var i = parseInt(href.substr(1), 10);
			var el = matches[i];

			focus(el);
		}
	});

	dialog.appendChild(tree);
};

var quickNav = function(selector) {
	var dialog = createDialog();
	buildTree(selector, dialog);
	dialog.showModal();
};

document.addEventListener('keyup', function(event) {
	if (event.ctrlKey && !event.altKey) {
		if (event.key == 'm') {
			event.preventDefault();
			quickNav('landmark');
		} else if (event.key == ',') {
			event.preventDefault();
			quickNav('heading');
		} else if (event.key == '.') {
			event.preventDefault();
			quickNav('link');
		}
	}
});

setTimeout(function() {
	var style = document.createElement('link');
	style.rel = 'stylesheet';
	style.href = chrome.extension.getURL('treeview.css');
	document.querySelector('head').append(style);
});
