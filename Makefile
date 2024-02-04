a11y-outline.firefox.zip: manifest.json icon-128.png bg.js outline.js treeview.js outline.css vendor
	rm -f $@
	zip -r $@ $^

a11y-outline.chromium.zip: manifest.chromium.json icon-128.png bg.js outline.js treeview.js outline.css vendor
	mkdir chromium
	cp -r $^ chromium
	cd chromium && mv manifest.chromium.json manifest.json && zip -r ../$@ *
	rm -r chromium

vendor:
	mkdir -p vendor
	wget https://raw.githubusercontent.com/xi/aria-api/0.6.0/dist/aria.js -O vendor/aria.js

icon-128.png: icon.svg
	convert -resize 128x -background transparent $< $@

clean:
	rm -rf vendor icon-128.png a11y-outline.firefox.zip a11y-outline.chromium.zip
