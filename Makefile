a11y-outline.firefox.zip: manifest.json icons/icon-48.png icons/icon-128.png src vendor
	rm -f $@
	zip -r $@ $^

a11y-outline.chromium.zip: manifest.chromium.json icon-48.png icon-128.png bg.js src vendor
	mkdir chromium
	cp -r $^ chromium
	cd chromium && mv manifest.chromium.json manifest.json && zip -r ../$@ *
	rm -r chromium

vendor:
	mkdir -p vendor
	wget https://raw.githubusercontent.com/xi/aria-api/0.7.0/dist/aria.js -O vendor/aria.js

icons/icon-48.png: icons/icon.svg
	convert -resize 48x -background transparent $< $@

icons/icon-128.png: icons/icon.svg
	convert -resize 128x -background transparent $< $@

clean:
	rm -rf vendor icons/icon-48.png icons/icon-128.png a11y-outline.firefox.zip a11y-outline.chromium.zip
