# UChicago Chess Club — the club's site

The University of Chicago Chess Club's own site, served by GitHub Pages at
**https://chughjug.github.io/uchicago-chess/**. Five hand-written HTML pages,
one stylesheet, three small scripts. No build step: edit a file, commit to the
`gh-pages` branch, and GitHub Pages publishes it within a minute or two.

This is the club site without the events platform: nothing calls a server,
and every page is a static file. The events page is a list you keep by hand
(below).

## Changing the content

**Almost everything lives in [`js/site.js`](js/site.js).** The meeting, the
officers, the sponsor, every social link. Change a value there and every page
follows, because the pages read it:

```html
<b data-site="meeting.whenLabel">Mondays, 8:00 PM</b>      <!-- text -->
<a data-site-href="links.discord" href="...">Discord</a>   <!-- href -->
```

The text already in the HTML is what shows before the script runs; `site.js`
overwrites it. So if the two ever disagree, `site.js` wins — put the real value
there.

### Common jobs

| Job | Where |
| --- | --- |
| New officers after an election | `SITE.officers` in `js/site.js` |
| Meeting moved (time, day, room) | `SITE.meeting` in `js/site.js`, then the two `EDIT-WITH-SITE.JS` comments in `index.html` |
| New Discord invite, new social account | `SITE.links` in `js/site.js` |
| Publish an officers email address | `SITE.contact.email` — the footer line appears only when it is set |
| New sponsor | `SITE.sponsor`, and the logo in `img/` |

The two `EDIT-WITH-SITE.JS` spots are the `<meta name="description">` and
`og:description` on the home page, which quote the meeting time. They have to
be plain HTML because Discord, Facebook and Google read the file without
running JavaScript.

## Events

The events page (`events.html`) is built from **[`js/events.js`](js/events.js)**:
one entry per event in `EVENTS` at the top of the file.

```js
{
  title: 'Autumn Blitz Night',
  date: '2026-10-16',          // leave out for "Date TBA"
  start: '7:00 PM', end: '10:00 PM',
  where: 'Cox Lounge, Stuart Hall',
  type: 'Tournament',          // the tag beside the title
  desc: 'Five-minute games, as many rounds as we can fit.',
  link: { label: 'Register', url: 'https://…' },
},
```

Only `title` is required; `endDate` covers an event over more than one day.
Order does not matter — the page sorts them, and moves an event from Upcoming
to Past by itself the day after it ends. Upcoming events with a date get an
*Add to calendar* link (Google Calendar, Chicago time) made from the same
values. The weekly Monday meeting is not in the list: it comes from
`SITE.meeting` in `js/site.js` and always heads Upcoming.

**The events there now are placeholders**, each with `example: true`, which
shows an *Example* tag on it and a line under the list saying so. Replace them
with real ones (or delete the `example: true` lines); once none is left, the
line goes. Examples are never told to search engines; real events are, as
structured data.

## Links are relative

The site is served from a sub-path (`/uchicago-chess/`), so every link, image,
stylesheet and script is written relative — `css/site.css`, `img/crest.png`,
`leadership.html`, and `./` for the home page — never with a leading `/`.
Keep new links that way, or they will point at `chughjug.github.io/` instead
of the site.

The full addresses in each page's head (`rel=canonical`, `og:url`,
`og:image`), in `SITE.org` and in `sitemap.xml` name
`https://chughjug.github.io/uchicago-chess/`. If the site moves to a domain
of its own, change them there.

## Adding a page

1. Copy `sponsors.html` (it is the shortest) and change the `<main>` content.
2. Update the `<title>`, the description, `og:title`, `og:description` and
   `rel=canonical` in the head — they are per page.
3. Add it to the nav and footer lists on all the pages, and to `sitemap.xml`.

## Images

`img/` holds what the pages use. Generated sizes come from `logo.jpg`:

| File | What it is |
| --- | --- |
| `crest.png` | the crest, at 128px — used at 26px in the nav and 42px in the masthead |
| `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` | browser and home-screen icons |
| `og-cover.jpg` | 1200×630 link preview |
| `logo.jpg` | the 1080px original, kept as the source for the above |
| `icons.svg` | one sprite for every social icon (`<use href="img/icons.svg#discord">`) |

To regenerate the sized files after replacing `logo.jpg` (needs `npm i sharp`):

```bash
node -e "
const sharp = require('sharp');
(async () => {
  await sharp('img/logo.jpg').resize(128,128).png().toFile('img/crest.png');
  await sharp('img/logo.jpg').resize(180,180).png().toFile('img/apple-touch-icon.png');
  await sharp('img/logo.jpg').resize(32,32).png().toFile('img/favicon-32.png');
  await sharp('img/logo.jpg').resize(16,16).png().toFile('img/favicon-16.png');
})();
"
```

## Style

`css/site.css` is the whole design: one sans (Gothic A1), one display serif
(Playfair), the club maroon used sparingly, and a lancet arch as the only
gothic flourish.

**After changing `css/site.css` or a script, bump its `?v=` number on every
page** (`css/site.css?v=2` → `?v=3`; one find-and-replace across the `.html`
files). GitHub Pages lets browsers keep those files for ten minutes, so
without a new number a visitor can get the new page with the old styles.

## Previewing locally

Serve the folder's parent so the site sits under the same sub-path it has on
GitHub Pages:

```bash
cd .. && python3 -m http.server 8000
# then open http://localhost:8000/uchicago-chess/
```
