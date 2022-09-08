PATH := node_modules/.bin:$(PATH)

bundle.zip: manifest.json icon-128.png bg.js outline.js treeview.js outline.css vendor
	rm -f $@
	zip -r $@ $^

vendor:
	mkdir -p vendor
	wget https://raw.githubusercontent.com/xi/aria-api/0.4.2/dist/aria.js -O vendor/aria.js
	wget https://raw.githubusercontent.com/GoogleChrome/dialog-polyfill/v0.5.6/dist/dialog-polyfill.js -O vendor/dialog-polyfill.js
	wget https://raw.githubusercontent.com/GoogleChrome/dialog-polyfill/v0.5.6/dist/dialog-polyfill.css -O vendor/dialog-polyfill.css

icon-128.png: icon.svg
	inkscape $< --export-filename=$@

outline.css: src/outline.scss node_modules
	npx sass $< $@

clean:
	rm -rf vendor outline.css
