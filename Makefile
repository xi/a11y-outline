outline.js: src/outline.js src/*.js node_modules
	npx browserify $< -o $@

node_modules:
	npm install aria-api@0.5.0

clean:
	rm -f outline.js
