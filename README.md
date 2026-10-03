# UChicago Chess Club — the club's site on GitHub Pages

**https://chughjug.github.io/uchicago-chess/**

These are the club site's own files from `uchicago.chessdirector.com`
(`client/public/club-sites/uchicago` in chughjug/ratings), unchanged except
for what GitHub Pages and the missing events platform need:

| What | Why |
| --- | --- |
| Links are relative (`css/site.css`, `img/crest.png`, `./`) instead of starting with `/` | The site is served from `/uchicago-chess/`, not the root of a domain |
| Events links go to `events.html` here | There is no chessdirector events page behind this site |
| `js/events.js` reads the events from a list in the file instead of asking chessdirector's server | Same reason; the rows it draws are the same markup and styles |
| No "Add to calendar" link on the home page | It was chessdirector's calendar feed |
| `events.html` is a page of its own | On chessdirector it only redirected to the platform |

Everything else — the stylesheet, `js/site.js`, `js/nav.js`, the images, and
every word on the pages — is the same file. The page addresses in each head
(`rel=canonical`, `og:url`) still name `uchicago.chessdirector.com`, the
club's main site.

## Editing

Commit to the `gh-pages` branch and GitHub Pages publishes it within a minute
or two. The meeting, officers, sponsor and links are in `js/site.js`, as on
the main site.

**Events** are in `EVENTS` at the top of [`js/events.js`](js/events.js), one
entry per event (the file says what each field does). The events page lists
them all and the home page's Upcoming shows the next two, after the weekly
meeting. The ones there now are placeholders, tagged *Example* — replace them
with real ones.

GitHub Pages lets browsers keep `css/site.css` and the scripts for ten
minutes, so after changing one, a reload may show the old version for a
little while.

To preview locally, serve the folder's parent so the site sits under the same
sub-path: `cd .. && python3 -m http.server 8000`, then open
http://localhost:8000/uchicago-chess/.
