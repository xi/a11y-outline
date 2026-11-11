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

function sendMessage(tab, msg) {
	chrome.tabs.sendMessage(tab.id, msg).catch(() => {
		injectCode(tab).then(() => {
			chrome.tabs.sendMessage(tab.id, msg);
		});
	});
}

chrome.action.onClicked.addListener(tab => {
	sendMessage(tab, 'showA11yOutline');
});

chrome.commands.onCommand.addListener(command => {
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		sendMessage(tabs[0], command);
	});
});
