a11y-outline - web extension to navigate page outlines easily

Many screen readers like JAWS or NVDA have shortcuts to bring up a list of
landmarks, headings or links. This browser extension provides the same
functionality without requiring a screen reader.

This is mainly useful for two audiences:

-	Sighted web developers who want to get a feeling for how blind users might
	experience their content.
-	Sighted users who like this kind of navigation.

# Installation

-	Download the code.
-	Run `make`. This requires `npm`, `browserify`, and `node-sass`.
-	In chrome, navigate to `chrome://extensions/`.
-	Make sure that "Developer mode" is checked.
-	Use "Load unpacked extension…"
-	You may need to add the keyboard shortcut manually.

# Usage

Pressing `Ctrl+7` brings up a dialog. You can use the up/down arrow keys to
select a list. With the tab key you can switch to the actual list and navigate
it with arrow keys.`

# Firefox support

This extension generally works on firefox. But the missing support for
`<dialog>` and `scrollIntoViewIfNeeded()` make keyboard navigation a rather
unpleasent experience.

# Note on HTML5 outline algorithm

This extension *does not* implement the [HTML5 outline
algorithm](https://www.w3.org/TR/html53/sections.html#creating-an-outline), as
that is also not available in common screen readers and works very differently
from the WAI-ARIA based outlines used here.
