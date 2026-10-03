/* ============================================================
   SITE CONTENT — this is the file to edit.

   Everything on this site that changes from year to year lives here:
   the meeting, the officers, the links, the sponsor. Change a value,
   reload, done. No build step, nothing to compile.

   The pages read it two ways:
     data-site="meeting.whenLabel"      → fills the element's text
     data-site-href="links.discord"     → fills the element's href
   and the officer cards on Who We Are are built from OFFICERS below.

   Two things are NOT here, because a link preview and a search result
   are read by machines that do not run JavaScript, so they have to be
   in the HTML itself. Both are marked with an EDIT-WITH-SITE.JS
   comment in the page:
     - the <meta name="description"> / og:description on index.html,
       which quotes the meeting time
     - the <title> of each page
   ============================================================ */

var SITE = {
  /** The club's standing meeting. Used in the hero, the footer, and the events list. */
  meeting: {
    whenLabel: 'Mondays, 8:00 PM',
    /** Start and end, for the events list row. */
    start: '8:00pm',
    end: '10:00pm',
    recurring: 'Mondays',
    cadence: 'every week of term',
    place: 'Cox Lounge',
    placeDetail: 'Stuart Hall basement',
    placeFull: 'Cox Lounge, basement of Stuart Hall',
    /** The line under the meeting in the footer. */
    terms: 'No signup, no dues, no rating requirement. Boards and clocks provided.',
    /** What happens at one, for the events list. */
    blurb: 'Casual games, blitz, and coaching. All levels welcome.',
    /** Two short facts beside the meeting in the hero. */
    cost: 'Free',
    costDetail: 'no dues, no signup',
    levels: 'All levels',
    levelsDetail: 'beginner to Grandmaster',
  },

  /**
   * Elected each Spring, in office from Autumn. Put the names in and the
   * Who We Are page picks them up — the piece is just the card's initial.
   */
  officers: [
    { role: 'President', name: 'Name TBA', piece: '♔' },
    { role: 'Vice President', name: 'Name TBA', piece: '♕' },
    { role: 'Treasurer', name: 'Name TBA', piece: '♖' },
    { role: 'Chair of Volunteering', name: 'Name TBA', piece: '♗' },
    { role: 'Chair of Inclusivity & Outreach', name: 'Name TBA', piece: '♘' },
  ],

  /**
   * An address for people who are not on Discord — a prospective member, a
   * parent, another club wanting a match, a sponsor. Left empty until the
   * club confirms one: the footer's contact line only appears when it is set,
   * so a wrong address is never published.
   */
  contact: {
    email: '',
    emailLabel: 'Email the officers',
  },

  sponsor: {
    name: 'Jane Street',
    url: 'https://www.janestreet.com/',
  },

  links: {
    discord: 'https://discord.com/invite/wnuyjCKNdM',
    instagram: 'https://www.instagram.com/uchicagochess/',
    facebook: 'https://www.facebook.com/groups/638162799532735',
    twitter: 'https://twitter.com/uchicagochess',
    twitch: 'https://www.twitch.tv/uchicagochess',
    chesscom: 'https://www.chess.com/club/uchicago-maroons-chess-club',
    lichess: 'https://lichess.org/team/uchicago-chess-club',
    groupme: 'https://web.groupme.com/join_group/69301822/sj0kw4Z3',
    blueprint: 'https://blueprint.uchicago.edu/organization/chess',
  },

  /** The events page. The events on it are in js/events.js. */
  events: {
    page: 'events.html',
  },

  /** For the structured data below: what search engines are told about the club. */
  org: {
    name: 'University of Chicago Chess Club',
    shortName: 'UChicago Chess',
    url: 'https://uchicago.chessdirector.com/',
    logo: 'https://uchicago.chessdirector.com/img/crest.png',
    description:
      'The University of Chicago Chess Club. Every experience level, from a first game to Grandmaster.',
    venue: {
      name: 'Cox Lounge, Stuart Hall',
      street: '5835 S Greenwood Ave',
      city: 'Chicago',
      region: 'IL',
      postalCode: '60637',
      country: 'US',
    },
  },
};

/* ------------------------------------------------------------
   Below here is plumbing. Edit the values above, not this.
   ------------------------------------------------------------ */

/** "meeting.placeFull" → the value, or '' if it is not set. */
function siteValue(path) {
  return String(
    path.split('.').reduce(function (node, key) {
      return node == null ? null : node[key];
    }, SITE) || ''
  );
}

/** Fill every [data-site] and [data-site-href] on the page. */
function applySiteContent(root) {
  var scope = root || document;

  Array.prototype.forEach.call(scope.querySelectorAll('[data-site]'), function (el) {
    var value = siteValue(el.getAttribute('data-site'));
    if (value) el.textContent = value;
  });

  Array.prototype.forEach.call(scope.querySelectorAll('[data-site-href]'), function (el) {
    var value = siteValue(el.getAttribute('data-site-href'));
    if (value) el.setAttribute('href', value);
  });

  // The contact line stays out of the page until there is an address to show.
  var contact = scope.querySelector('[data-site-contact]');
  if (contact) {
    if (SITE.contact.email) {
      var link = document.createElement('a');
      link.href = 'mailto:' + SITE.contact.email;
      link.textContent = SITE.contact.emailLabel || SITE.contact.email;
      contact.innerHTML = '';
      contact.appendChild(link);
    } else {
      contact.remove();
    }
  }
}

/** The officer cards on Who We Are, from SITE.officers. */
function renderOfficers() {
  var grid = document.getElementById('officers');
  if (!grid) return;
  grid.innerHTML = SITE.officers
    .map(function (o) {
      return (
        '<div class="person">' +
        '<div class="av arch">' + o.piece + '</div>' +
        '<h3>' + siteEscape(o.name) + '</h3>' +
        '<p class="role">' + siteEscape(o.role) + '</p>' +
        '</div>'
      );
    })
    .join('');
}

function siteEscape(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

/**
 * Structured data, generated from the values above so it cannot drift from
 * what the page says. The Organization block is what lets a search result
 * carry the club's name, crest and links; the weekly meeting is published as
 * a recurring event so the day and time can show with it.
 */
function publishStructuredData() {
  var v = SITE.org.venue;
  var place = {
    '@type': 'Place',
    name: v.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: v.street,
      addressLocality: v.city,
      addressRegion: v.region,
      postalCode: v.postalCode,
      addressCountry: v.country,
    },
  };

  var graph = [
    {
      '@type': 'SportsOrganization',
      '@id': SITE.org.url + '#club',
      name: SITE.org.name,
      alternateName: SITE.org.shortName,
      description: SITE.org.description,
      url: SITE.org.url,
      logo: SITE.org.logo,
      sport: 'Chess',
      location: place,
      sameAs: [
        SITE.links.discord,
        SITE.links.instagram,
        SITE.links.facebook,
        SITE.links.twitter,
        SITE.links.twitch,
        SITE.links.chesscom,
        SITE.links.lichess,
      ],
    },
  ];

  // The standing meeting, as an event series: the one thing a student
  // searching for the club actually wants to know.
  if (document.getElementById('preview')) {
    graph.push({
      '@type': 'EventSeries',
      name: 'UChicago Chess Club weekly meeting',
      description: SITE.meeting.blurb,
      url: SITE.org.url,
      eventSchedule: {
        '@type': 'Schedule',
        repeatFrequency: 'P1W',
        byDay: 'https://schema.org/Monday',
        startTime: '20:00',
        endTime: '22:00',
        scheduleTimezone: 'America/Chicago',
      },
      location: place,
      organizer: { '@id': SITE.org.url + '#club' },
      isAccessibleForFree: true,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    });
  }

  var tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(tag);
}

document.addEventListener('DOMContentLoaded', function () {
  applySiteContent();
  renderOfficers();
  publishStructuredData();
});
