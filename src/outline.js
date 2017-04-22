var aria = require('aria-api');

var createDialog = function(selector) {
	var dialog = document.createElement('dialog');
	dialog.addEventListener('close', function() {
		dialog.remove();
	});
	dialog.style = 'max-width: 90vw; max-height: 90vh; overflow: auto;';
	document.body.appendChild(dialog);
	return dialog;
};

var createList = function(items) {
	var ul = document.createElement('ul');
	ul.style.margin = 0;
	Array.prototype.forEach.call(items, function(item) {
		var li = document.createElement('li');
		li.appendChild(item);
		ul.appendChild(li);
	});
	return ul;
};

var quickNav = function(selector, needsFocus) {
	var matches = aria.querySelectorAll(document, selector)
		.filter(function(el) {
			return !aria.matches(el, ':hidden');
		});
	var dialog = createDialog();

	var links = Array.prototype.map.call(matches, function(el) {
		var a = document.createElement('a');
		a.href = '#';
		a.addEventListener('click', function(event) {
			event.preventDefault();
			dialog.close();
			if (needsFocus) {
				el.tabIndex = -1;
			}
			el.focus();
		});

		var name = aria.getName(el, null, true);
		if (name) {
			a.textContent = name + ' ';
		}

		a.textContent += aria.getRole(el);

		var description = aria.getDescription(el);
		if (description && description != name) {
			a.title = description;
		}
		return a;
	});

	dialog.appendChild(createList(links));
	dialog.showModal();
};

document.addEventListener('keyup', function(event) {
	if (event.ctrlKey && !event.altKey) {
		if (event.key == 'm') {
			event.preventDefault();
			quickNav('landmark', true);
		} else if (event.key == ',') {
			event.preventDefault();
			quickNav('heading', true);
		} else if (event.key == '.') {
			event.preventDefault();
			quickNav('link', false);
		}
	}
});
