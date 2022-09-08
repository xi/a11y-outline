a11y-outline - web extension to navigate page outlines easily

Many screen readers like JAWS or NVDA have shortcuts to bring up a list of
landmarks, headings or links. This browser extension provides the same
functionality without requiring a screen reader. It therefore implements
[Success Criterion 1.9.1 of
UAAG20](https://www.w3.org/TR/UAAG20/#gl-alternative-views).

This is mainly useful for two audiences:

-	Sighted web developers who want to get a feeling for how blind users might
	experience their content.
-	Sighted users who like this kind of navigation.

# Installation

## Firefox

See <https://addons.mozilla.org/de/firefox/addon/a11y-outline/>

## Chrome

-	Download the [latest release](https://github.com/xi/a11y-outline/releases)
	and unpack.
-	In chrome, navigate to `chrome://extensions/`.
-	Make sure that "Developer mode" is checked.
-	Use "Load unpacked extension…"
-	You may need to add the keyboard shortcut manually (at the bottom of the
	extensions page).

## Bookmarklet

A bookmarklet is available on <https://xi.github.io/a11y-outline/>.

## Building manually

Running `make` should be sufficient. This requires `npx`.

# Usage

Pressing `Ctrl+Shift+7` brings up a dialog. You can use the up/down arrow keys
to select a list. With the tab key you can switch to the actual list and
navigate it with arrow keys.`

Optionally you can create shortcuts for some additional commands in your
browser settings.

# Note on HTML5 outline algorithm

This extension *does not* implement the [HTML5 outline
algorithm](https://www.w3.org/TR/html53/sections.html#creating-an-outline), as
that is also not available in common screen readers and works very differently
from the WAI-ARIA based outlines used here.
