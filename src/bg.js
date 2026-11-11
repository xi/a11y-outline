/* global chrome */

function injectCode(tab) {
	return Promise.all([
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			files: [
				'/vendor/aria.js',
				'/src/treeview.js',
				'/src/outline.js',
			],
		}),
		chrome.scripting.insertCSS({
			target: {tabId: tab.id},
			files: ['/src/outline.css'],
		}),
	]);
}

chrome.action.onClicked.addListener(tab => {
	injectCode(tab).then(() => {
		chrome.tabs.sendMessage(tab.id, 'showA11yOutline');
	});
});

chrome.commands.onCommand.addListener(command => {
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		injectCode(tabs[0]).then(() => {
			chrome.tabs.sendMessage(tabs[0].id, command);
		});
	});
});
