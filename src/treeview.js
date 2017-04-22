// http://accessibleculture.org/articles/2013/02/not-so-simple-aria-tree-views-and-screen-readers/
// https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView

var indexOf = function(list, item) {
	return Array.prototype.indexOf.call(list, item);
};

var searchUp = function(el, role) {
	if (!el) {
		return null;
	} else if (el.getAttribute('role') === role) {
		return el;
	} else {
		return searchUp(el.parentElement, role);
	}
};

var activate = function(item) {
	if (item) {
		var tree = searchUp(item, 'tree');
		tree.setAttribute('aria-activedescendant', item.id);

		// selection follows focus
		var old = tree.querySelector('[aria-selected="true"]');
		if (old) {
			old.setAttribute('aria-selected', false);
		}
		item.setAttribute('aria-selected', true);
	}
};

var toggleGroup = function(item) {
	var expanded = item.getAttribute('aria-expanded') === 'true';
	item.setAttribute('aria-expanded', !expanded);
};

var nextItem = function(item, direction) {
	var next;

	if (direction === 'parent') {
		if (item.parentElement.getAttribute('role') === 'group') {
			next = item.parentElement.parentElement;
		}
	} else {
		var tree = searchUp(item, 'tree');
		var items = tree.querySelectorAll('[role="treeitem"]');
		var hidden = tree.querySelectorAll('[aria-expanded="false"] [role="treeitem"]');

		var i = indexOf(items, item);
		var dir = direction === 'up' ? -1 : 1;
		i += dir;
		while (i >= 0 && i < items.length) {
			if (indexOf(hidden, items[i]) === -1) {
				next = items[i];
				break;
			}
			i += dir;
		}
	}

	activate(next);
};

var onKeyDown = function(event) {
	if (!(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)) {
		var item = this.querySelector('[aria-selected="true"]');

		switch (event.which) {
			case 38:  // up
				event.preventDefault();
				nextItem(item, 'up');
				break;
			case 40:  // down
				event.preventDefault();
				nextItem(item, 'down');
				break;
			case 37:  // left
				event.preventDefault();
				if (item.getAttribute('aria-expanded') === 'true') {
					toggleGroup(item);
				} else {
					nextItem(item, 'parent');
				}
				break;
			case 39:  // right
				event.preventDefault();
				if (item.getAttribute('aria-expanded') === 'true') {
					nextItem(item, 'down');
				} else if (item.hasAttribute('aria-expanded')) {
					toggleGroup(item);
				}
				break;
			case 32:  // space
				event.preventDefault();
				if (item.hasAttribute('aria-expanded')) {
					toggleGroup(item);
				}
				break;
			case 13:  // enter
				var link = item.querySelector('a');
				link.click();
				break;
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
		item.setAttribute('aria-expanded', false);
		item.appendChild(buildToggle());
		item.appendChild(buildGroup(data.children, id));
	}

	return item;
};

var buildList = function(data, id) {
	var list = document.createElement('ul');
	data.forEach(function(child, i) {
		var item = buildItem(child, id + '.' + i);
		list.appendChild(item);
	});
	return list;
};

var buildGroup = function(data, id) {
	var group = buildList(data, id);
	group.setAttribute('role', 'group');
	return group;
};

var buildTree = function(data, id) {
	var tree = buildList(data, id, 0);
	tree.setAttribute('role', 'tree');
	tree.tabIndex = 0;
	tree.id = id;
	tree.className = 'treeview';

	tree.addEventListener('keydown', onKeyDown);
	tree.addEventListener('click', function(event) {
		var item = searchUp(event.target, 'treeitem');
		activate(item);
		this.focus();
	});

	var first = tree.querySelector('[role="treeitem"]');
	activate(first);

	return tree;
};

module.exports = buildTree;