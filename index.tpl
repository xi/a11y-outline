<title>a11y-outline Bookmarklet</title>

<style>
    body {
        color: #333;
        max-width: 20em;
        margin: 0 auto;
        padding: 1em;
    }
    .bookmarklet {
        display: block;
        border: 1px dashed;
        text-align: center;
    }
</style>

<h1>a11y-outline</h2>

<p>Simply drag this link to your bookmarks bar or try by just clicking it.</p>
<a class="bookmarklet" href="javascript:(function(){__JS__})()">a11y-outline</a>

<p>
<strong>Note</strong>:
Bookmarklets do not work properly on modern sites that have a
<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy">Content Security Policy</a>
(<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=866522">firefox issue</a>,
<a href="https://bugs.chromium.org/p/chromium/issues/detail?id=233903">chrome issue</a>).
I therefore recommend to use the <a href="https://addons.mozilla.org/de/firefox/addon/a11y-outline/">firefox extension</a> instead.
For more information see the <a href="https://github.com/xi/a11y-outline">github repo</a>.
</p>
