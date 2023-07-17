/* global chrome */

var wrap = function(fn) {
	return function(...args) {
		return new Promise((resolve) => {
			fn(...args, result => {
				resolve(result);
			});
		});
	};
};

var executeScript = wrap(chrome.tabs.executeScript);

var injectCode = function() {
	return Promise.all([
		executeScript({file: '/vendor/aria.js'}),
		executeScript({file: '/treeview.js'}),
		executeScript({file: '/outline.js'}),
	]);
};

chrome.browserAction.onClicked.addListener(function(tab) {
	injectCode().then(() => {
		chrome.tabs.sendMessage(tab.id, 'showA11yOutline');
	});
});

chrome.commands.onCommand.addListener(function(command) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		injectCode().then(() => {
			chrome.tabs.sendMessage(tabs[0].id, command);
		});
	});
});
