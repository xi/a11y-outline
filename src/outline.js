var aria = require('aria-api');
var treeview = require('./treeview');

var createDialog = function() {
	var dialog = document.createElement('dialog');
	dialog.id = 'a11y-outline';
	dialog.addEventListener('close', function() {
		dialog.remove();
	});
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
		href: '#' + i,
		children: [],
		element: el
	};
};

var focus = function(el) {
	el.focus();
	if (document.activeElement !== el) {
		el.tabIndex = -1;
		el.focus();
	}
};

var isDescendant = function(el, ancestor) {
	if (!el) {
		return false;
	} else if (el === ancestor) {
		return true;
	} else {
		return isDescendant(el.parentElement, ancestor);
	}
};

var insertItem = function(item, list) {
	var itemLevel = aria.getAttribute(item.element, 'level');
	var last = list[list.length - 1];
	if (last) {
		if (itemLevel > aria.getAttribute(last.element, 'level') ||
				isDescendant(item.element, last.element)) {
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

var updateVisiblePane = function(select, dialog) {
	var trees = aria.querySelectorAll(dialog, 'tree');
	Array.prototype.forEach.call(trees, function(tree) {
		tree.hidden = (tree.id !== select.value);
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

	buildTree('landmark', dialog);
	buildTree('heading', dialog);
	buildTree('link', dialog);

	updateVisiblePane(select, dialog);
	dialog.showModal();
};

document.addEventListener('keyup', function(event) {
	if (event.shiftKey && !event.ctrlKey && !event.altKey) {
		if (event.key === 'F7') {
			event.preventDefault();
			quickNav();
		}
	}
});

setTimeout(function() {
	var style = document.createElement('link');
	style.rel = 'stylesheet';
	style.href = chrome.extension.getURL('outline.css');
	document.querySelector('head').append(style);
});
