/* global chrome */

var wrap = function(fn) {
	return function(...args) {
		return new Promise(resolve => fn(...args, resolve));
	};
};

var executeScript = wrap(chrome.scripting.executeScript);
var insertCSS = wrap(chrome.scripting.insertCSS);

var injectCode = function(tab) {
	return Promise.all([
		executeScript({
			target: {tabId: tab.id},
			files: [
				'/vendor/aria.js',
				'/treeview.js',
				'/outline.js',
			],
		}),
		insertCSS({
			target: {tabId: tab.id},
			files: ['/outline.css'],
		}),
	]);
};

chrome.action.onClicked.addListener(function(tab) {
	injectCode(tab).then(() => {
		chrome.tabs.sendMessage(tab.id, 'showA11yOutline');
	});
});

chrome.commands.onCommand.addListener(function(command) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		injectCode(tabs[0]).then(() => {
			chrome.tabs.sendMessage(tabs[0].id, command);
		});
	});
});
