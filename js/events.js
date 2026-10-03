/* ============================================================
   EVENTS — the file to edit for the events list.

   EVENTS below is every event the club is running: the events page
   (events.html) lists them all, and the home page's Upcoming shows
   the next two. Order does not matter — they are sorted by date, and
   one moves from Upcoming to Past by itself once its day is over.

   Each event:
     name        what it is called                      (required)
     start_date  'YYYY-MM-DD'; leave out for "Date to be announced"
     location    the room or building, or 'Online'
     details     anything else for the line: the time, the time
                 control, the rounds — e.g. '7:00pm · G/5 · 6 rounds'
     link        a page for it (a registration form, say): the name
                 and a Details chip link there
     linkLabel   the chip's words, if not "Details"
     example     true on the placeholders below, which carry an
                 "Example" tag; delete them when the real ones are in

   FIXTURES is for the standing Monday meeting, which is a fixture of
   the club rather than an event: it comes from SITE.meeting in
   js/site.js and always leads the list.
   ============================================================ */

/** The club's events. Replace the examples with the real ones. */
var EVENTS = [
  {
    name: 'Welcome Back Social',
    start_date: '2026-09-28',
    location: 'Cox Lounge, basement of Stuart Hall',
    details: '8:00pm–10:00pm',
    example: true
  },
  {
    name: 'Autumn Blitz Night',
    start_date: '2026-10-16',
    location: 'Cox Lounge, basement of Stuart Hall',
    details: '7:00pm · G/5 · 6 rounds',
    link: 'https://discord.com/invite/wnuyjCKNdM',
    linkLabel: 'Sign up',
    example: true
  },
  {
    name: 'Collegiate Chess League match',
    start_date: '2026-10-24',
    location: 'Online',
    details: '1:00pm',
    example: true
  },
  {
    name: 'Autumn Rated Rapid',
    start_date: '2026-11-07',
    location: 'Location to be announced',
    details: 'G/15+10 · 5 rounds · US Chess rated',
    link: 'https://discord.com/invite/wnuyjCKNdM',
    linkLabel: 'Register',
    example: true
  },
  {
    name: 'Simul with a titled player',
    start_date: '2026-11-20',
    location: 'Location to be announced',
    details: '7:00pm',
    example: true
  }
];

/**
 * The standing Monday meeting is a fixture of the club, not an event. The facts come from SITE (js/site.js) so
 * the meeting is written down once for the whole site.
 */
var FIXTURES = [
  {
    recurring: SITE.meeting.recurring,
    start: SITE.meeting.start,
    end: SITE.meeting.end,
    title: 'Weekly Club Meeting',
    where: SITE.meeting.placeFull,
    desc: SITE.meeting.blurb
  }
];


var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseDate(s) {
  if (!s) return null;
  var p = String(s).slice(0, 10).split('-');
  if (p.length !== 3) return null;
  var d = new Date(+p[0], +p[1] - 1, +p[2]);
  return isNaN(d.getTime()) ? null : d;
}

/** A plain date — "Oct 7, 2026" — the way the rest of the platform writes one. */
function dateLabel(iso) {
  var d = parseDate(iso);
  if (!d) return 'Date to be announced';
  return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

function whereLabel(ev) {
  if (ev.location) return ev.location;
  var parts = [ev.city, ev.state].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Location to be announced';
}

/** One event: name, the date and the details on one line, a chip if it has a page. */
function tournamentHTML(ev, isPast) {
  var href = ev.link ? esc(ev.link) : '';
  var tag = ev.example ? '<span class="tag">Example</span>' : '';
  var meta = [whereLabel(ev), ev.details].filter(Boolean).join(' · ');
  var name = href
    ? '<a href="' + href + '" target="_blank" rel="noopener">' + esc(ev.name) + '</a>'
    : esc(ev.name);

  return '<article class="event' + (isPast ? ' past' : '') + '">' +
           '<div class="event-body">' +
             '<h3>' + name + '</h3>' + tag +
             '<p class="event-where"><b class="event-date">' + esc(dateLabel(ev.start_date)) +
               '</b>' + (meta ? ' · ' + esc(meta) : '') + '</p>' +
           '</div>' +
           (href ? '<span class="event-action"><a class="chip" href="' + href + '" target="_blank" rel="noopener">' +
             esc(ev.linkLabel || 'Details') + '</a></span>' : '') +
         '</article>';
}

/** A standing club fixture, which has no page of its own. */
function fixtureHTML(fx) {
  var hours = fx.start ? fx.start + (fx.end ? '–' + fx.end : '') : '';
  var when = [fx.recurring, hours].filter(Boolean).join(', ');
  var meta = [fx.where, fx.desc].filter(Boolean).join(' · ');
  return '<article class="event">' +
           '<div class="event-body">' +
             '<h3>' + esc(fx.title) + '</h3>' +
             '<p class="event-where"><b class="event-date">' + esc(when) + '</b>' +
               (meta ? ' · ' + esc(meta) : '') + '</p>' +
           '</div>' +
         '</article>';
}

function fill(id, html) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function renderEvents(events) {
  var today = new Date(); today.setHours(0, 0, 0, 0);
  // By date, with the ones still to be dated after the rest.
  var when = function (e) { var d = parseDate(e.start_date); return d ? d.getTime() : Infinity; };
  var dated = events.filter(function (e) { return e && e.name; }).sort(function (a, b) {
    return when(a) === when(b) ? 0 : when(a) < when(b) ? -1 : 1;
  });

  var upcoming = dated.filter(function (e) {
    var d = parseDate(e.start_date);
    return !d || d >= today;
  });
  var past = dated.filter(function (e) {
    var d = parseDate(e.start_date);
    return d && d < today;
  }).reverse();

  var fixtures = FIXTURES.map(fixtureHTML).join('');

  fill('upcoming', fixtures + (upcoming.length
    ? upcoming.map(function (e) { return tournamentHTML(e, false); }).join('')
    : '<div class="empty">Nothing else on the calendar yet. Monday is still Monday.</div>'));

  fill('past', past.length
    ? past.map(function (e) { return tournamentHTML(e, true); }).join('')
    : '<div class="empty">No past events to show.</div>');

  // The homepage shows the next couple, the weekly meeting first.
  fill('preview', fixtures + upcoming.slice(0, 2).map(function (e) {
    return tournamentHTML(e, false);
  }).join(''));
}

document.addEventListener('DOMContentLoaded', function () {
  renderEvents(EVENTS);
});
