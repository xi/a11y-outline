PATH := node_modules/.bin:$(PATH)

all: outline.js outline.css

bundle.zip: manifest.json icon-128.png bg.js outline.js outline.css
	zip $@ $^

outline.js: src/outline.js src/*.js node_modules
	browserify $< -o $@

outline.css: src/outline.scss node_modules
	node-sass $< $@

node_modules:
	npm install aria-api dialog-polyfill

clean:
	rm -f outline.js outline.css
