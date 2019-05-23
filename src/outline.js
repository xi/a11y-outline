var aria = require('aria-api');
var dialogPolyfill = require('dialog-polyfill');
var treeview = require('./treeview');

var DIALOG_ID = 'a11y-outline';

var focus = function(el) {
	el.focus();
	if (document.activeElement !== el) {
		el.tabIndex = -1;
		el.focus();
	}
};

var createDialog = function() {
	var dialog = document.createElement('dialog');
	dialog.id = DIALOG_ID;
	dialog.addEventListener('close', function() {
		dialog.remove();
	});
	document.body.appendChild(dialog);

	if (!dialog.showModal) {
		dialogPolyfill.registerDialog(dialog);
	}

	return dialog;
};

var createItem = function(el, i) {
	var label = aria.getAttribute(el, 'roledescription') || aria.getRole(el);
	if (aria.matches(el, 'heading')) {
		label += ' ' + aria.getAttribute(el, 'level');
	}
	var name = aria.getName(el, null, true);
	if (name) {
		label = name + ' ' + label;
	}

	return {
		label: label,
		href: '#' + i,
		children: [],
		element: el
	};
};

var insertItem = function(item, list) {
	var itemLevel = aria.getAttribute(item.element, 'level');
	var last = list[list.length - 1];
	if (last) {
		if (itemLevel > aria.getAttribute(last.element, 'level') ||
				last.element.contains(item.element)) {
			return insertItem(item, last.children);
		}
	}
	list.push(item);
};

var buildTree = function(role, dialog) {
	var matches = aria.querySelectorAll(document, role)
		.filter(function(el) {
			return !aria.matches(el, ':hidden');
		});

	var items = [];
	for (var i = 0; i < matches.length; i++) {
		insertItem(createItem(matches[i], i), items);
	}
	var tree = treeview(items, dialog.id + '-' + role);

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

var updateVisiblePane = function(select, dialog) {
	var id = dialog.id + '-' + select.value;
	if (!document.getElementById(id)) {
		buildTree(select.value, dialog);
	}

	var trees = dialog.querySelectorAll('[role="tree"]');
	Array.prototype.forEach.call(trees, function(tree) {
		tree.hidden = (tree.id !== id);
	});
};

var quickNav = function() {
	var dialog = createDialog();

	var select = document.createElement('select');
	select.innerHTML =
		'<option value="landmark">Landmarks</option>' +
		'<option value="heading">Headings</option>' +
		'<option value="link">Links</option>';
	select.addEventListener('change', function(event) {
		updateVisiblePane(select, dialog);
	});
	dialog.appendChild(select);

	var style = document.createElement('link');
	style.rel = 'stylesheet';
	style.href = chrome.extension.getURL('outline.css');
	dialog.appendChild(style);

	updateVisiblePane(select, dialog);
	dialog.showModal();
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request === 'showA11yOutline' && sender) {
		if (!document.getElementById(DIALOG_ID)) {
			quickNav();
		}
	}
});
