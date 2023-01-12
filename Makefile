bundle.zip: manifest.json icon-128.png bg.js outline.js treeview.js outline.css vendor
	rm -f $@
	zip -r $@ $^

vendor:
	mkdir -p vendor
	wget https://raw.githubusercontent.com/xi/aria-api/0.4.7/dist/aria.js -O vendor/aria.js

icon-128.png: icon.svg
	inkscape $< --export-filename=$@

outline.css: src/outline.scss
	npx sass $< $@

clean:
	rm -rf vendor outline.css
