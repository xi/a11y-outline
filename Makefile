all: outline.js treeview.css

outline.js: src/outline.js src/*.js node_modules
	browserify $< -o $@

treeview.css: src/treeview.scss
	node-sass $< $@

node_modules:
	npm install aria-api
