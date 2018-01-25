var fs = require('fs');

fs.readFile('index.tpl', {encoding: 'utf8'}, function(err, tpl) {
	fs.readFile('outline.min.js', {encoding: 'utf8'}, function(err, js) {
		fs.writeFile('index.html', tpl.replace('__JS__', encodeURI(js)), function() {
			console.log('updated index.html');
		});
	});
});
