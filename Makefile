PATH := node_modules/.bin:$(PATH)

bundle.zip: manifest.json icon-128.png bg.js outline.js treeview.js outline.css
	mkdir -p vendor
	cp node_modules/aria-api/dist/aria.js vendor/
	cp node_modules/dialog-polyfill/dist/dialog-polyfill.js vendor/
	cp node_modules/dialog-polyfill/dialog-polyfill.css vendor/
	rm -f $@
	zip -r $@ $^ vendor

icon-128.png: icon.svg
	inkscape $< --export-filename=$@

outline.css: src/outline.scss node_modules
	npx sass $< $@

node_modules:
	npm install aria-api@0.4.2 dialog-polyfill@0.5.6

clean:
	rm -rf vendor outline.css
