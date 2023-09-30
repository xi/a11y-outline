var aria = require('aria-api');
var treeview = require('./treeview');

var DIALOG_ID = 'a11y-outline';

var focus = function(el) {
	el.focus();
	if (document.activeElement !== el) {
		el.tabIndex = -1;
		el.focus();
	}

	var y = el.getBoundingClientRect().top;
	var h = document.documentElement.clientHeight;
	if (y > h / 2) {
		document.scrollingElement.scrollBy(0, y - h / 2);
	}
};

var setTarget = function(target) {
	document.querySelectorAll('.a11y-outline-target').forEach(el => {
		el.classList.remove('a11y-outline-target');
	});
	if (target) {
		target.classList.add('a11y-outline-target');
	}
};

var createDialog = function() {
	var dialog = document.createElement('dialog');
	dialog.id = DIALOG_ID;
	dialog.addEventListener('close', function() {
		dialog.remove();
		setTarget(null);
	});
	document.body.appendChild(dialog);
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
		element: el,
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

var getMatches = function(role) {
	return aria.querySelectorAll(document, role)
		.filter(el => !aria.matches(el, ':hidden'));
};

var buildTree = function(matches) {
	var items = [];
	for (var i = 0; i < matches.length; i++) {
		insertItem(createItem(matches[i], i), items);
	}
	return items;
};

var renderTree = function(role, dialog) {
	var ul = treeview.build([], dialog.id + '-' + role);
	ul.setAttribute('aria-busy', 'true');

	dialog.appendChild(ul);

	setTimeout(() => {
		var matches = getMatches(role).filter(el => !dialog.contains(el));
		var tree = buildTree(matches);

		if (matches.length) {
			treeview.update(ul, tree, ul.id);
		} else {
			ul.innerHTML = '<li><em>Nothing found</em></li>';
		}
		ul.setAttribute('aria-busy', 'false');

		var getTarget = function(a) {
			var href = a.getAttribute('href');
			var i = parseInt(href.substr(1), 10);
			return matches[i];
		};

		ul.addEventListener('click', function(event) {
			if (event.target.matches('a')) {
				event.preventDefault();
				dialog.close();
				focus(getTarget(event.target));
			}
		});

		var targetSelected = function() {
			var target = null;

			if (ul === document.activeElement) {
				var selected = ul.querySelector('[aria-selected="true"] a');
				target = getTarget(selected);
			}

			setTarget(target);
		};

		var mouseoutTimeoutId = null;
		ul.addEventListener('mouseover', event => {
			if (event.target.matches('a')) {
				clearTimeout(mouseoutTimeoutId);
				var target = getTarget(event.target);
				setTarget(target);
			}
		});
		ul.addEventListener('mouseout', () => {
			clearTimeout(mouseoutTimeoutId);
			mouseoutTimeoutId = setTimeout(targetSelected, 100);
		});
		ul.addEventListener('focus', targetSelected);
		ul.addEventListener('select', targetSelected);
		ul.addEventListener('blur', targetSelected);
	});
};

var updateVisiblePane = function(select, dialog) {
	var id = dialog.id + '-' + select.value;
	if (!document.getElementById(id)) {
		renderTree(select.value, dialog);
	}

	var trees = dialog.querySelectorAll('[role="tree"]');
	Array.prototype.forEach.call(trees, function(tree) {
		tree.hidden = (tree.id !== id);
	});
};

var quickNav = function() {
	var dialog = createDialog();

	var header = document.createElement('header');
	dialog.appendChild(header);

	var select = document.createElement('select');
	select.innerHTML =
		'<option value="landmark">Landmarks</option>' +
		'<option value="heading">Headings</option>' +
		'<option value="link">Links</option>';
	select.addEventListener('change', function() {
		updateVisiblePane(select, dialog);
	});
	select.autofocus = true;
	header.appendChild(select);

	var close = document.createElement('button');
	close.addEventListener('click', () => dialog.close());
	close.textContent = '✕';
	close.title = 'Close';
	close.setAttribute('aria-label', 'Close');
	close.className = 'close';
	close.tabIndex = -1;
	header.appendChild(close);

	var style = document.createElement('link');
	style.rel = 'stylesheet';
	style.href = 'https://xi.github.io/a11y-outline/outline.css';
	dialog.appendChild(style);

	updateVisiblePane(select, dialog);
	style.addEventListener('load', () => {
		dialog.showModal();
	});
};

quickNav();
