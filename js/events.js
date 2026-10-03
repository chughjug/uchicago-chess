/* ============================================================
   EVENTS — this is the file to edit for the events page.

   One entry per event in EVENTS below. Order does not matter: the
   page sorts them, puts anything still to come under Upcoming and
   anything over under Past. The weekly Monday meeting is not listed
   here — it comes from SITE.meeting in js/site.js and always sits at
   the top of Upcoming.

   Each event:
     title     what it is called                        (required)
     date      'YYYY-MM-DD'; leave out for "Date TBA"
     endDate   'YYYY-MM-DD', for an event over more than one day
     start     '7:00 PM'   end '10:00 PM'               (optional)
     where     the room, building or 'Online'           (optional)
     type      a short tag: 'Tournament', 'Social', 'Team match',
               'Teaching', 'Talk' — anything you like    (optional)
     desc      a sentence or two                         (optional)
     link      { label: 'Register', url: 'https://…' }   (optional)
     example   true on the placeholders below — they show an
               "Example" tag. Delete them, or the line, when the
               real calendar is in.

   Upcoming events with a date get an "Add to calendar" link
   (Google Calendar) built from these values; nothing else to do.
   ============================================================ */

var EVENTS = [
  {
    title: 'Welcome Back Social',
    date: '2026-09-28',
    start: '8:00 PM',
    end: '10:00 PM',
    where: 'Cox Lounge, Stuart Hall',
    type: 'Social',
    desc: 'First meeting of the year: pizza, casual games, and the officers saying hello.',
    example: true,
  },
  {
    title: 'Autumn Blitz Night',
    date: '2026-10-16',
    start: '7:00 PM',
    end: '10:00 PM',
    where: 'Cox Lounge, Stuart Hall',
    type: 'Tournament',
    desc: 'Five-minute games, as many rounds as we can fit. Unrated, free, and over by ten.',
    link: { label: 'Sign up on Discord', url: 'https://discord.com/invite/wnuyjCKNdM' },
    example: true,
  },
  {
    title: 'Collegiate Chess League match',
    date: '2026-10-24',
    start: '1:00 PM',
    end: '4:00 PM',
    where: 'Online',
    type: 'Team match',
    desc: 'Our CCL team plays its next league match. Come watch the boards or cheer in the Discord.',
    example: true,
  },
  {
    title: 'Autumn Rated Rapid',
    date: '2026-11-07',
    endDate: '2026-11-08',
    start: '10:00 AM',
    end: '5:00 PM',
    where: 'Location TBA',
    type: 'Tournament',
    desc: 'A US Chess rated rapid over two days. Entry is covered by the club for UChicago students.',
    link: { label: 'Register', url: 'https://discord.com/invite/wnuyjCKNdM' },
    example: true,
  },
  {
    title: 'Simul with a titled player',
    date: '2026-11-20',
    start: '7:00 PM',
    end: '9:00 PM',
    where: 'Location TBA',
    type: 'Talk',
    desc: 'One strong player against the room, then questions. Boards go fast — sign up early.',
    example: true,
  },
  {
    title: 'Winter Quarter Kickoff',
    type: 'Social',
    desc: 'Date to be set once Winter Quarter rooms are booked.',
    example: true,
  },
];

/* ------------------------------------------------------------
   Below here is plumbing. Edit the events above, not this.
   ------------------------------------------------------------ */

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var CLUB_TIMEZONE = 'America/Chicago';

/** 'YYYY-MM-DD' → a local Date at midnight, or null. */
function eventDay(iso) {
  var p = String(iso || '').split('-');
  if (p.length !== 3) return null;
  var d = new Date(+p[0], +p[1] - 1, +p[2]);
  return isNaN(d.getTime()) ? null : d;
}

/** '7:00 PM' → { h: 19, m: 0 }, or null. */
function eventTime(s) {
  var m = /^\s*(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m?\.?\s*$/i.exec(String(s || ''));
  if (!m) return null;
  var h = +m[1] % 12 + (m[3].toLowerCase() === 'p' ? 12 : 0);
  return { h: h, m: +(m[2] || 0) };
}

/** "Fri, Oct 16" — or "Sat, Nov 7 – Sun, Nov 8" — or "Date TBA". */
function eventDateLabel(ev) {
  var d = eventDay(ev.date);
  if (!d) return 'Date TBA';
  var label = DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
  var e = eventDay(ev.endDate);
  if (e && e > d) label += ' – ' + DAYS[e.getDay()] + ', ' + MONTHS[e.getMonth()] + ' ' + e.getDate();
  return label;
}

function eventHours(ev) {
  return ev.start ? ev.start + (ev.end ? '–' + ev.end : '') : '';
}

function eventEscape(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

function pad2(n) {
  return (n < 10 ? '0' : '') + n;
}

function stamp(d, t) {
  var s = d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate());
  return t ? s + 'T' + pad2(t.h) + pad2(t.m) + '00' : s;
}

/** A Google Calendar link for an event with a date, in the club's time zone. */
function calendarLink(ev) {
  var d = eventDay(ev.date);
  if (!d) return '';
  var last = eventDay(ev.endDate) || d;
  var from = eventTime(ev.start);
  var to = eventTime(ev.end);
  var dates;
  if (from) {
    // Timed: from the start on the first day to the end on the last
    // (two hours after the start if no end is given).
    var until = to || { h: Math.min(from.h + 2, 23), m: from.m };
    dates = stamp(d, from) + '/' + stamp(last, until);
  } else {
    // All day: Google wants the day after the last one.
    var after = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
    dates = stamp(d) + '/' + stamp(after);
  }
  var q = [
    'action=TEMPLATE',
    'text=' + encodeURIComponent(ev.title),
    'dates=' + dates,
    'ctz=' + encodeURIComponent(CLUB_TIMEZONE),
  ];
  if (ev.desc) q.push('details=' + encodeURIComponent(ev.desc));
  if (ev.where) q.push('location=' + encodeURIComponent(ev.where));
  return 'https://calendar.google.com/calendar/render?' + q.join('&');
}

function eventHTML(ev, isPast) {
  var tags = (ev.type ? '<span class="tag">' + eventEscape(ev.type) + '</span>' : '') +
             (ev.example ? '<span class="tag example">Example</span>' : '');
  var meta = [eventHours(ev), ev.where].filter(Boolean).join(' · ');
  var actions = '';
  if (ev.link && ev.link.url) {
    actions += '<a class="chip" href="' + eventEscape(ev.link.url) + '" target="_blank" rel="noopener">' +
               eventEscape(ev.link.label || 'Details') + '</a>';
  }
  if (!isPast) {
    var cal = calendarLink(ev);
    if (cal) actions += '<a class="chip" href="' + eventEscape(cal) + '" target="_blank" rel="noopener">Add to calendar</a>';
  }
  return '<article class="event' + (isPast ? ' past' : '') + '">' +
           '<div class="event-body">' +
             '<h3>' + eventEscape(ev.title) + '</h3>' + tags +
             '<p class="event-where"><b class="event-date">' + eventEscape(eventDateLabel(ev)) + '</b>' +
               (meta ? ' · ' + eventEscape(meta) : '') + '</p>' +
             (ev.desc ? '<p class="event-desc">' + eventEscape(ev.desc) + '</p>' : '') +
           '</div>' +
           (actions ? '<div class="event-action">' + actions + '</div>' : '') +
         '</article>';
}

/** The standing Monday meeting, from SITE.meeting in js/site.js. */
function weeklyHTML() {
  var m = SITE.meeting;
  return '<article class="event weekly">' +
           '<div class="event-body">' +
             '<h3>Weekly Club Meeting</h3><span class="tag">Every week</span>' +
             '<p class="event-where"><b class="event-date">' + eventEscape(m.whenLabel) + '</b> · ' +
               eventEscape(m.placeFull) + '</p>' +
             '<p class="event-desc">' + eventEscape(m.blurb) + '</p>' +
           '</div>' +
         '</article>';
}

/** Search engines are told about real events only, never the examples. */
function publishEventData(upcoming) {
  var real = upcoming.filter(function (ev) { return !ev.example && eventDay(ev.date); });
  if (!real.length) return;
  var graph = real.map(function (ev) {
    var t = eventTime(ev.start);
    var item = {
      '@type': 'Event',
      name: ev.title,
      startDate: ev.date + (t ? 'T' + pad2(t.h) + ':' + pad2(t.m) : ''),
      eventAttendanceMode: ev.where === 'Online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
      organizer: { '@type': 'SportsOrganization', name: SITE.org.name, url: SITE.org.url },
    };
    if (ev.endDate) item.endDate = ev.endDate;
    if (ev.desc) item.description = ev.desc;
    if (ev.where && ev.where !== 'Online') item.location = { '@type': 'Place', name: ev.where };
    if (ev.link && ev.link.url) item.url = ev.link.url;
    return item;
  });
  var tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(tag);
}

function renderEvents() {
  var upcomingEl = document.getElementById('upcoming');
  var pastEl = document.getElementById('past');
  if (!upcomingEl) return;

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var lastDay = function (ev) { return eventDay(ev.endDate) || eventDay(ev.date); };
  var byDate = function (a, b) { return eventDay(a.date) - eventDay(b.date); };

  // Undated events are still to come, and go after the dated ones.
  var upcoming = EVENTS.filter(function (ev) { return !lastDay(ev) || lastDay(ev) >= today; });
  var dated = upcoming.filter(function (ev) { return eventDay(ev.date); }).sort(byDate);
  var undated = upcoming.filter(function (ev) { return !eventDay(ev.date); });
  var past = EVENTS.filter(function (ev) { return lastDay(ev) && lastDay(ev) < today; })
    .sort(byDate).reverse();

  var rows = dated.concat(undated).map(function (ev) { return eventHTML(ev, false); }).join('');
  upcomingEl.innerHTML = weeklyHTML() + (rows ||
    '<div class="empty">Nothing else on the calendar yet. Monday is still Monday.</div>');

  if (pastEl) {
    pastEl.innerHTML = past.length
      ? past.map(function (ev) { return eventHTML(ev, true); }).join('')
      : '<div class="empty">No past events yet.</div>';
  }

  var note = document.getElementById('examples-note');
  if (note) note.hidden = !EVENTS.some(function (ev) { return ev.example; });

  publishEventData(dated);
}

document.addEventListener('DOMContentLoaded', renderEvents);
