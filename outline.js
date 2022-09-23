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

var createDialog = function() {
	var dialog = document.createElement('dialog');
	dialog.id = DIALOG_ID;
	dialog.addEventListener('close', function() {
		dialog.remove();
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
	var matches = getMatches(role);
	var tree = buildTree(matches);

	var ul = treeview(tree, dialog.id + '-' + role);

	ul.addEventListener('click', function(event) {
		if (event.target.matches('a')) {
			event.preventDefault();
			dialog.close();

			var href = event.target.getAttribute('href');
			var i = parseInt(href.substr(1), 10);
			var el = matches[i];

			focus(el);
		}
	});

	dialog.appendChild(ul);
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
	style.href = chrome.runtime.getURL('outline.css');
	dialog.appendChild(style);

	updateVisiblePane(select, dialog);
	dialog.showModal();
};

var _walk = function(root, fn) {
	fn(root);
	aria.getChildNodes(root).forEach(function(child) {
		_walk(child, fn);
	});
};

var walk = function(root, fn) {
	try {
		_walk(document, function(node) {
			if (node.nodeType === node.ELEMENT_NODE) {
				fn(node);
			}
		});
	} catch (e) {
		if (e !== 'StopIteration') {
			throw e;
		}
	}
};

var focusNext = function(selector) {
	var target;
	var next = false;
	walk(document, function(node) {
		if (node === document.activeElement) {
			next = true;
		} else if ((!target || next) && aria.matches(node, selector)) {
			target = node;
			if (next) {
				throw 'StopIteration';
			}
		}
	});
	if (target) {
		focus(target);
	}
}

var focusPrev = function(selector) {
	var target;
	walk(document, function(node) {
		if (node === document.activeElement) {
			throw 'StopIteration';
		} else if (aria.matches(node, selector)) {
			target = node;
		}
	});
	if (target) {
		focus(target);
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (document.getElementById(DIALOG_ID)) {
		return;
	} else if (request === 'showA11yOutline') {
		quickNav();
	} else if (request === 'cycle-main') {
		focusNext('main');
	} else if (request === 'next-landmark') {
		focusNext('landmark');
	} else if (request === 'prev-landmark') {
		focusPrev('landmark');
	}
});
