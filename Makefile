outline.js: src/outline.js node_modules
	browserify $< -o $@

node_modules:
	npm install aria-api
