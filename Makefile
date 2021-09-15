PATH := node_modules/.bin:$(PATH)

all: outline.js outline.css

bundle.zip: manifest.json icon-128.png bg.js outline.js outline.css
	zip $@ $^

icon-128.png: icon.svg
	inkscape $< --export-filename=$@

outline.js: src/outline.js src/*.js node_modules
	browserify $< -o $@

outline.css: src/outline.scss node_modules
	sassc $< $@

node_modules:
	npm install aria-api@0.4.0 dialog-polyfill

clean:
	rm -f outline.js outline.css
