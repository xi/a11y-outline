a11y-outline - chrome extension to navigate page outlines easily

Many screen readers like JAWS or NVDA have shortcuts to bring up a list of
landmarks, headings or links. This browser extension provides the same
functionality without requiring a screen reader.

This is mainly useful for two audiences:

-	Sighted web developers who want to get a feeling for how blind users might
	experience their content.
-	Sighted users who like this kind of navigation.

# Usage

Pressing `Ctrl+7` brings up a dialog. You can use the up/down arrow keys to
select a list. With the tab key you can switch to the actual list and navigate
it with arrow keys.`

# Firefox support

This extension generally works on firefox. But the missing support for
`<dialog>` and `scrollIntoViewIfNeeded()` make keyboard navigation a rather
unpleasent experience.
