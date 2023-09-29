# 2.0.0 (2023-09-29)

-   switch to manifest v3
-   require less permissions (`activeTab` instead of `<all_urls>`)


# 1.6.1 (2023-07-06)

-   fix: do not include contents of dialog in results
-   fix: transparent background for extension icon
-   fix: ignore host site styling for dialogs
-   tweak colors in dark mode


# 1.6.0 (2023-06-07)

-   update aria-api to 0.5.0
-   set aria-busy for spinner
-   fix: do not show spinner if no items are found


# 1.5.2 (2023-01-12)

-   update aria-api to 0.4.7
-   show a spinner if gathering the data takes a long time


# 1.5.1 (2023-01-08)

-   update aria-api to 0.4.6
-   cycle on focusPrev()
-   add explicit extension ID


# 1.5.0 (2022-10-11)

-   highlight target on focus/hover
-   add shortcuts to navigate headings
-   add dark mode
-   use initial font-size in popup


# 1.4.0 (2022-10-10)

-   update aria-api to 0.4.5
-   add an explicit close button


# 1.3.0 (2022-09-23)

-   No longer include dialog-polyfill because all modern browsers now have
    native support


# 1.2.2 (2022-09-09)

-   Avoid preprocessing code so it is not necessary to submut source code
    separately to mozilla


# 1.2.1 (2022-08-27)

-   update aria-api to 0.4.2
-   fix `chrome.extension.getURL()` deprecation warning
-   friendlier dialog styling


# 1.2.0 (2021-08-20)

-   improve treeview styles
-   isolate treeview styles from current page styles


# 1.1.1 (2021-06-03)

-   improve scroll into view behavior
-   fix icon transparency


# 1.1.0 (2020-09-10)

-   update aria-api to 0.4.0
-   add shortcuts for main, next landmark, previous landmark


# 1.0.4 (2018-05-23)

-   update aria-api to 0.3.0


# 1.0.3 (2018-03-01)

-   update aria-api to 0.2.4


# 1.0.2 (2018-02-14)

-   update aria-api to 0.2.2 (fixing many issues with name calculation)


# 1.0.1 (2018-01-25)

-   display heading level
-   change default shortcut to `Ctrl+Shift+7` (#1)
-   add bookmarklet (#2)
-   avoid stacking multiple dialogs (#3)
-   avoid small font-size on some websites (#4)


# 1.0.0 (2018-01-21)

-   initial release
