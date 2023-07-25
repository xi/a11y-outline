a11y-outline.zip: manifest.json icon-128.png bg.js outline.js treeview.js outline.css vendor
	rm -f $@
	zip -r $@ $^

vendor:
	mkdir -p vendor
	wget https://raw.githubusercontent.com/xi/aria-api/0.5.0/dist/aria.js -O vendor/aria.js

icon-128.png: icon.svg
	convert -resize 128x -background transparent $< $@

clean:
	rm -rf vendor icon-128.png bundle.zip
