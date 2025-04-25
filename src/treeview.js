// http://accessibleculture.org/articles/2013/02/not-so-simple-aria-tree-views-and-screen-readers/
// https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView

var indexOf = function(list, item) {
	return Array.prototype.indexOf.call(list, item);
};

var typeaheadString = '';
var typeaheadTimeout = null;
var typeahead = function(c) {
	typeaheadString += c;

	clearTimeout(typeaheadTimeout);
	typeaheadTimeout = setTimeout(function() {
		typeaheadString = '';
	}, 400);

	return typeaheadString;
};

var select = function(item) {
	if (item) {
		var tree = item.closest('[role="tree"]');
		tree.setAttribute('aria-activedescendant', item.id);

		item.scrollIntoView({block: 'nearest'});

		// selection follows focus
		var old = tree.querySelector('[aria-selected="true"]');
		if (old) {
			old.setAttribute('aria-selected', false);
		}
		item.setAttribute('aria-selected', true);

		var event = new CustomEvent('select', {bubbles: true});
		item.dispatchEvent(event);
	}
};

var toggleGroup = function(item) {
	var expanded = item.getAttribute('aria-expanded') === 'true';
	item.setAttribute('aria-expanded', !expanded);
};

var nextItem = function(item, direction, query) {
	var next;

	if (direction === 'parent') {
		if (item.parentElement.getAttribute('role') === 'group') {
			next = item.parentElement.parentElement;
		}
	} else {
		var tree = item.closest('[role="tree"]');
		var items = tree.querySelectorAll('[role="treeitem"]');
		var hidden = tree.querySelectorAll('[aria-expanded="false"] [role="treeitem"]');

		var i = indexOf(items, item);
		if (direction === 'start') i = -1;
		if (direction === 'end') i = items.length;
		var dir = direction === 'up' || direction === 'end' ? -1 : 1;
		if (!query) {
			i += dir;
		}
		while (i >= 0 && i < items.length) {
			if (indexOf(hidden, items[i]) === -1) {
				if (!query || query.test(items[i].textContent)) {
					next = items[i];
					break;
				}
			}
			i += dir;
		}
	}

	select(next);
};

var onKeyDown = function(event) {
	if (!(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)) {
		var item = this.querySelector('[aria-selected="true"]');

		switch (event.key) {
			case 'End':
				event.preventDefault();
				nextItem(item, 'end');
				break;
			case 'Home':
				event.preventDefault();
				nextItem(item, 'start');
				break;
			case 'ArrowUp':
				event.preventDefault();
				nextItem(item, 'up');
				break;
			case 'ArrowDown':
				event.preventDefault();
				nextItem(item, 'down');
				break;
			case 'ArrowLeft':
				event.preventDefault();
				if (item.getAttribute('aria-expanded') === 'true') {
					toggleGroup(item);
				} else {
					nextItem(item, 'parent');
				}
				break;
			case 'ArrowRight':
				event.preventDefault();
				if (item.getAttribute('aria-expanded') === 'true') {
					nextItem(item, 'down');
				} else if (item.hasAttribute('aria-expanded')) {
					toggleGroup(item);
				}
				break;
			case 'Enter':
				var link = item.querySelector('a');
				link.click();
				break;
			default:
				if (event.key.length === 1) {
					var s = typeahead(event.key);
					var r = new RegExp('^' + s, 'i');
					nextItem(item, 'down', r);
				}
		}
	}
};

var buildToggle = function() {
	var toggle = document.createElement('button');
	toggle.setAttribute('aria-hidden', true);
	toggle.tabIndex = -1;

	toggle.addEventListener('click', function(event) {
		event.preventDefault();
		var item = this.parentElement;
		toggleGroup(item);
	});

	return toggle;
};

var buildLink = function(data, id) {
	var link = document.createElement('a');
	link.setAttribute('role', 'presentation');
	link.tabIndex = -1;
	link.id = id + '-link';

	link.textContent = data.label;
	link.href = data.href;

	return link;
};

var buildItem = function(data, id) {
	var item = document.createElement('li');
	item.setAttribute('role', 'treeitem');
	item.id = id;
	item.setAttribute('aria-labelledby', id + '-link');
	item.setAttribute('aria-selected', false);

	item.appendChild(buildLink(data, id));

	if (data.children && data.children.length) {
		item.setAttribute('aria-expanded', true);
		item.appendChild(buildToggle());
		item.appendChild(buildGroup(data.children, id));
	}

	return item;
};

var updateList = function(list, data, id) {
	list.innerHTML = '';
	data.forEach(function(child, i) {
		var item = buildItem(child, id + '.' + i);
		list.appendChild(item);
	});
};

var buildList = function(data, id) {
	var list = document.createElement('ul');
	updateList(list, data, id);
	return list;
};

var buildGroup = function(data, id) {
	var group = buildList(data, id);
	group.setAttribute('role', 'group');
	return group;
};

var updateTree = function(tree, data, id) {
	tree.innerHTML = '';
	updateList(tree, data, id);

	var first = tree.querySelector('[role="treeitem"]');
	select(first);
};

var buildTree = function(data, id) {
	var tree = document.createElement('ul');
	tree.setAttribute('role', 'tree');
	tree.tabIndex = 0;
	tree.id = id;
	tree.className = 'treeview';

	tree.addEventListener('keydown', onKeyDown);
	tree.addEventListener('click', function(event) {
		var item = event.target;
		if (!item.matches('[role="treeitem"]')) {
			item = item.closest('[role="treeitem"]');
		}
		select(item);
		this.focus();
	});

	updateTree(tree, data, id);
	return tree;
};

window.treeview = {
	build: buildTree,
	update: updateTree,
};