all: outline.js outline.css

outline.js: src/outline.js src/*.js node_modules
	browserify $< -o $@

outline.css: src/outline.scss
	node-sass $< $@

node_modules:
	npm install aria-api
