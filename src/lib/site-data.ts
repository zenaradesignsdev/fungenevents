/**
 * Centralised content for the FunGen Events marketing site.
 *
 * Keeping copy + imagery in one typed module lets the page components stay
 * presentational and makes future content edits a one-file change.
 *
 * All imagery lives locally under /public/images/gallery (downloaded from the
 * original design's stock sources) so it is served same-origin — required by
 * the `img-src 'self'` Content-Security-Policy in next.config.mjs.
 */

const G = (name: string) => `/images/gallery/${name}.jpg`

export type NavLink = { label: string; href: string }

/** Full site map — used by the footer and the sitemap. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
]

/**
 * Header navigation — Contact is omitted because the nav already carries a
 * "Start Planning" button (and the mobile menu a "Book a Consultation" CTA)
 * pointing at the same page.
 */
export const PRIMARY_NAV_LINKS: NavLink[] = NAV_LINKS.filter(
  (link) => link.href !== '/contact',
)

export const SOCIAL_LINKS: NavLink[] = [
  { label: 'Instagram', href: '#' },
  { label: 'Pinterest', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'LinkedIn', href: '#' },
]

/* ─────────────────────────  Services  ───────────────────────── */

export type Faq = { q: string; a: string }

export type Service = {
  id: string
  num: string
  title: string
  kicker: string
  lede: string
  body: string
  included: string[]
  options: string[]
  faqs: Faq[]
  cta: string
  image: string
  alt: string
}

export const SERVICES: Service[] = [
  {
    id: 'birthdays',
    num: '01',
    title: 'Birthdays',
    kicker: 'Milestones & namesakes',
    lede: 'Luxury birthday celebrations customized for every age — from a first birthday to a seventieth.',
    body: 'A good birthday is specific. We build the evening around the person being celebrated: the food they actually love, the music they grew up on, the friends who need to be seated together. Private dining rooms, rooftops, family homes and full venue buyouts.',
    included: [
      'Concept, palette and guest journey',
      'Venue sourcing and site visits',
      'Catering, bar and cake coordination',
      'Décor, florals and lighting design',
      'Guest list, invitations and RSVPs',
      'On-site management through strike',
    ],
    options: [
      'Live band, DJ or string trio',
      'Custom cocktail and menu development',
      'Photo and video coverage',
      'Late-night food and favour design',
    ],
    faqs: [
      { q: 'How far in advance should we book?', a: 'Eight to twelve weeks is comfortable for a seated dinner of forty. For larger buyouts or peak-season weekends, four to six months.' },
      { q: 'Do you plan children’s parties?', a: 'Yes — first birthdays through sweet sixteens. We keep the design grown-up enough for the adults and the schedule tight enough for the kids.' },
      { q: 'Is there a minimum budget?', a: 'Our birthday engagements typically start in the mid four figures for planning and design, exclusive of vendor costs. We will tell you on the first call if we are the wrong fit.' },
    ],
    cta: 'Plan a birthday',
    image: G('birthday-balloons'),
    alt: 'Balloons floating at a birthday celebration',
  },
  {
    id: 'weddings',
    num: '02',
    title: 'Weddings',
    kicker: 'Full-service planning',
    lede: 'Elegant wedding planning and coordination, from the first walkthrough to the last dance.',
    body: 'We take one to two weddings a month, deliberately. That means real design development, a budget you can trust, and a lead planner who knows your family by name. Ceremony logistics, multi-day itineraries and destination coordination included.',
    included: [
      'Full design direction and mood development',
      'Venue and vendor selection',
      'Budget building and payment tracking',
      'Floor plans, seating and paper suite',
      'Rehearsal and ceremony coordination',
      'Wedding-day management, two planners minimum',
    ],
    options: [
      'Welcome party and farewell brunch',
      'Guest travel and accommodation blocks',
      'Custom builds — arbors, bars, installations',
      'Cultural and multi-faith ceremony production',
    ],
    faqs: [
      { q: 'Do you offer month-of coordination only?', a: 'Occasionally, when the calendar allows. Most couples come to us for full planning, which is where we can actually protect the budget and the design.' },
      { q: 'Will you travel?', a: 'Yes. Roughly a third of our weddings are destination events. Travel and accommodation are billed at cost.' },
      { q: 'How many meetings should we expect?', a: 'Typically ten to fourteen across the engagement, plus unlimited email. We would rather over-communicate early than improvise late.' },
    ],
    cta: 'Enquire about your date',
    image: G('wedding-couple'),
    alt: 'Couple on their wedding day',
  },
  {
    id: 'anniversaries',
    num: '03',
    title: 'Anniversaries',
    kicker: 'Marking the years',
    lede: 'Meaningful celebrations honoring life’s milestones — quietly, or with everyone you know.',
    body: 'Anniversaries are the most under-designed events we see. A tenth deserves more than a dinner reservation; a fiftieth deserves a room that tells the story. We build both, often with archival photography, family toasts and a menu that references the original wedding.',
    included: [
      'Story and archive-led design concept',
      'Venue, catering and bar coordination',
      'Florals, lighting and tablescape design',
      'Toast programme and run of show',
      'Invitation and guest communications',
      'On-site coordination',
    ],
    options: [
      'Vow renewal ceremony production',
      'Photo archive display or slideshow',
      'Live jazz, quartet or dance instruction',
      'Legacy book or guest letters',
    ],
    faqs: [
      { q: 'Can you plan a surprise?', a: 'Often, and we are good at it. We handle the choreography, the cover story and the arrival moment. Discretion is part of the service.' },
      { q: 'Do you do smaller, intimate dinners?', a: 'Yes. Some of our favourite work has been twelve people around one table.' },
      { q: 'Can family members be involved in planning?', a: 'Absolutely — we often work with adult children as the clients while keeping the honourees unaware.' },
    ],
    cta: 'Plan an anniversary',
    image: G('crystal-glassware'),
    alt: 'Crystal glassware on an elegant table',
  },
  {
    id: 'social',
    num: '04',
    title: 'Social Events',
    kicker: 'Gatherings of every kind',
    lede: 'Private parties, reunions, graduations, baby showers and the gatherings in between.',
    body: 'The social calendar is where families actually live. We bring the same production discipline to a graduation lunch as to a gala — clear timelines, vetted vendors, and a host who gets to sit down. Ideal for clients who entertain several times a year.',
    included: [
      'Concept and theme development',
      'Venue or at-home layout planning',
      'Catering, rentals and staffing',
      'Décor and tablescape styling',
      'Invitations, RSVPs and signage',
      'Day-of coordination',
    ],
    options: [
      'Bar programme and mixologist',
      'Activity or entertainment programming',
      'Children’s care and kids’ room',
      'Valet, transport and guest logistics',
    ],
    faqs: [
      { q: 'Do you plan events in private homes?', a: 'Frequently. We handle power, kitchen capacity, guest flow, noise and neighbours — the parts that quietly determine whether a home party works.' },
      { q: 'What is the smallest event you take?', a: 'Around twenty guests for full planning. Below that we usually offer a styling and vendor-sourcing engagement instead.' },
      { q: 'Can you work with our existing vendors?', a: 'Yes. If you have a caterer you love, we brief them into the run of show like any other partner.' },
    ],
    cta: 'Plan a gathering',
    image: G('social-guests'),
    alt: 'Guests in conversation at a social event',
  },
  {
    id: 'entertainment',
    num: '05',
    title: 'Entertainment',
    kicker: 'Live production',
    lede: 'Concerts, festivals, themed events, performances and live experiences.',
    body: 'Our production side handles ticketed and branded live events: stage design, audio and lighting vendors, artist advancing, security planning, permits and crowd flow. We work with venues, promoters and brands who need a partner comfortable with load-in schedules and city paperwork.',
    included: [
      'Production schedule and site plan',
      'Stage, audio, lighting and video vendors',
      'Artist advancing and hospitality',
      'Permits, insurance and safety planning',
      'Crew scheduling and load-in management',
      'Show calling and on-site production team',
    ],
    options: [
      'Ticketing and box-office setup',
      'Sponsor activations and branded builds',
      'VIP and green-room programmes',
      'Content capture and livestream',
    ],
    faqs: [
      { q: 'What size productions do you take?', a: 'From two-hundred-capacity rooms to multi-stage outdoor events of several thousand. Above that we partner with a specialist production house.' },
      { q: 'Do you handle permits and licensing?', a: 'Yes — noise, occupancy, alcohol and street-use applications, plus insurance certificates for every vendor on site.' },
      { q: 'Can you produce a themed corporate experience?', a: 'Yes. Immersive and themed events are some of our most requested work; we design the world and then engineer it to be safe and serviceable.' },
    ],
    cta: 'Discuss a production',
    image: G('vocalist-stage'),
    alt: 'Vocalist performing under stage lights',
  },
  {
    id: 'nonprofit',
    num: '06',
    title: 'Nonprofit Events',
    kicker: 'Fundraising & galas',
    lede: 'Fundraisers, galas, charity events, auctions, donor appreciation and community celebrations.',
    body: 'Nonprofit events are measured, not admired. We design for the number: donor journey from invitation to ask, room layout that supports the programme, and a run of show tight enough that the paddle raise lands while the room is warm. In-kind sourcing where we can find it.',
    included: [
      'Fundraising goal and budget modelling',
      'Donor journey and table strategy',
      'Programme and run of show design',
      'Auction and paddle-raise production',
      'Sponsor recognition and signage',
      'Volunteer briefing and on-site management',
    ],
    options: [
      'Silent auction platform setup',
      'Live auctioneer and emcee sourcing',
      'Impact film and storytelling segment',
      'Post-event donor reporting package',
    ],
    faqs: [
      { q: 'Do you offer nonprofit rates?', a: 'Yes. We reserve a portion of each season for mission-aligned organisations at a reduced planning fee, and we help pursue in-kind vendor support.' },
      { q: 'Can you help increase net revenue, not just attendance?', a: 'That is the point. We model the budget against expected giving and cut spend that does not move the number.' },
      { q: 'Do you work with volunteer committees?', a: 'Often. We give committees clear, bounded roles and a written schedule so their energy goes where it helps most.' },
    ],
    cta: 'Plan a fundraiser',
    image: G('gala-toast'),
    alt: 'Guests toasting at a gala',
  },
]

/* ─────────────────────────  Home page  ───────────────────────── */

export const HERO_META = [
  { label: 'Disciplines', value: 'Weddings · Milestones · Galas · Live events' },
  { label: 'Consultations', value: 'Open for 2026 & 2027' },
  { label: 'Service area', value: 'Toronto, GTA & destinations' },
]

export const HERO_HIGHLIGHTS = {
  primary: {
    image: G('wedding-first-dance'),
    alt: 'First dance under warm festoon lighting at a FunGen wedding',
    eyebrow: 'Last October',
    caption: 'The Long Table — Willow Barn, 180 guests',
  },
  secondary: {
    image: G('candlelit-tablescape'),
    alt: 'Candlelit tablescape with layered florals',
  },
  quote: {
    text: 'The run of show was so tight our board chair actually got to eat dinner.',
    author: 'Priya V. · North Ward Trust',
  },
}

export const DISCIPLINE_MARQUEE = SERVICES.map((s) => s.title)

export const STUDIO_PILLARS = [
  { num: '01', title: 'Personal by default', body: 'No package menus. We design from your story.' },
  { num: '02', title: 'Obsessive detail', body: 'Linens to load-in times, documented and checked.' },
  { num: '03', title: 'Honest budgets', body: 'Clear numbers early, no surprises later.' },
  { num: '04', title: 'Calm execution', body: 'On the day, you are a guest at your own event.' },
]

export const REASONS = [
  { num: '01', title: 'Personalized event planning', body: 'One lead planner from first call to final invoice — the same person who heard your story is the one running your night.' },
  { num: '02', title: 'Creative design concepts', body: 'Mood, palette, floor plan and lighting developed together, so the room reads as one idea rather than a collection of rentals.' },
  { num: '03', title: 'Flawless coordination', body: 'Minute-by-minute run of show shared with every vendor, plus a rehearsal for anything with moving parts.' },
  { num: '04', title: 'Trusted vendor network', body: 'Florists, chefs, bands and technicians we have worked beside for years — and who answer the phone at 6am.' },
  { num: '05', title: 'Memorable guest experiences', body: 'We design the arrival, the seating and the exit, because guests remember transitions more than centerpieces.' },
  { num: '06', title: 'Professional event management', body: 'Permits, insurance, load-in logistics and contingency plans handled quietly in the background.' },
]

export type Testimonial = { quote: string; author: string; role: string }

export const TESTIMONIALS: Testimonial[] = [
  { quote: 'We came in with a spreadsheet and a lot of anxiety. FunGen turned it into an evening our families still talk about — and they did it without ever making us feel rushed or upsold.', author: 'Amara & Daniel R.', role: 'Wedding, 220 guests — Riverside Estate' },
  { quote: 'Our gala raised thirty percent more than the previous year. The run of show was so tight that our board chair actually got to eat dinner.', author: 'Priya Venkatesan', role: 'Executive Director, Northgate Youth Foundation' },
  { quote: 'My mother has never once been surprised in her life. She cried in the doorway. That is the entire review.', author: 'Marcus Whitfield', role: '70th Birthday, private residence' },
]

/* ─────────────────────────  Portfolio  ───────────────────────── */

export type PortfolioItem = {
  cat: string
  tag: string
  title: string
  meta: string
  year: string
  image: string
  ratio: 'portrait' | 'square'
  alt: string
}

export const PORTFOLIO_CATS = ['All', 'Weddings', 'Birthdays', 'Anniversaries', 'Social', 'Entertainment', 'Nonprofit']

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { cat: 'Weddings', tag: 'Wedding', title: 'The Long Table, Willow Barn', meta: '180 guests · Willow Barn Estate', year: '2025', image: G('wedding-first-dance'), ratio: 'portrait', alt: 'First dance under warm festoon lighting' },
  { cat: 'Anniversaries', tag: 'Anniversary', title: 'Forty Years, One Courtyard', meta: '86 guests · private courtyard', year: '2025', image: G('banquet-table'), ratio: 'square', alt: 'Long banquet table laid with place settings' },
  { cat: 'Birthdays', tag: 'Birthday', title: 'Midnight Confetti, Loft 9', meta: '120 guests · 30th birthday', year: '2026', image: G('confetti-crowd'), ratio: 'portrait', alt: 'Confetti falling over a crowd' },
  { cat: 'Nonprofit', tag: 'Nonprofit Gala', title: 'The Northgate Benefit', meta: '400 guests · $1.2M raised', year: '2025', image: G('ballroom-round-tables'), ratio: 'square', alt: 'Ballroom set with round tables' },
  { cat: 'Entertainment', tag: 'Entertainment', title: 'After Hours Sessions', meta: '900 capacity · 3-night residency', year: '2026', image: G('mirror-balls'), ratio: 'portrait', alt: 'Mirror balls above a dance floor' },
  { cat: 'Social', tag: 'Social', title: 'Garden Reunion, Hillcrest', meta: '60 guests · family reunion', year: '2025', image: G('outdoor-guests'), ratio: 'square', alt: 'Guests gathered outdoors in daylight' },
  { cat: 'Weddings', tag: 'Wedding', title: 'Ceremony at Dusk', meta: '140 guests · coastal chapel', year: '2024', image: G('wedding-couple'), ratio: 'square', alt: 'Couple photographed on their wedding day' },
  { cat: 'Entertainment', tag: 'Festival', title: 'Riverfront Live', meta: '2,400 capacity · two stages', year: '2025', image: G('outdoor-concert'), ratio: 'portrait', alt: 'Crowd at an outdoor concert' },
  { cat: 'Birthdays', tag: 'Birthday', title: 'Seventy, Quietly', meta: '24 guests · private residence', year: '2026', image: G('crystal-glassware'), ratio: 'square', alt: 'Crystal glassware on a candlelit table' },
  { cat: 'Social', tag: 'Social', title: 'The Graduation Lunch', meta: '48 guests · rooftop terrace', year: '2025', image: G('two-guests'), ratio: 'portrait', alt: 'Two guests in conversation holding glasses' },
  { cat: 'Nonprofit', tag: 'Auction', title: 'Paddles Up, Harbour House', meta: '220 guests · donor evening', year: '2024', image: G('toast-auction'), ratio: 'portrait', alt: 'Guests raising glasses in a toast' },
  { cat: 'Anniversaries', tag: 'Vow Renewal', title: 'Twenty-Five, Rewritten', meta: '70 guests · vineyard terrace', year: '2026', image: G('reception-ballroom'), ratio: 'square', alt: 'Tables set in a softly lit room' },
]

export const PORTFOLIO_STORIES = [
  {
    index: '01',
    title: 'Forty Years, One Courtyard',
    image: G('banquet-table'),
    imageAlt: 'A long banquet table laid for an anniversary dinner',
    imageRatio: 'square' as const,
    imageFirst: true,
    paragraphs: [
      'Their children came to us with one photograph: the couple, forty years earlier, at a folding table in a small courtyard. We rebuilt that table for eighty-six people — one continuous run down the middle of a stone courtyard, lit only by tapers and one string of festoon.',
      'The menu came from the original wedding. The toast order was set so the youngest grandchild spoke last. No stage, no band, no photo wall — the only thing we added was time.',
    ],
    quote: 'They didn’t recreate a photograph. They recreated a feeling we hadn’t had in forty years.',
    attribution: 'The Alvarez family — 40th anniversary',
  },
  {
    index: '02',
    title: 'The Northgate Benefit',
    image: G('ballroom-round-tables'),
    imageAlt: 'Ballroom set with round tables for a benefit gala',
    imageRatio: 'portrait' as const,
    imageFirst: false,
    paragraphs: [
      'A youth foundation with a tired gala: four hundred guests, a ninety-minute programme, and giving that had flattened for three years running. We cut the programme to thirty-one minutes, moved the ask before dessert, and rebuilt the seating so every table had a host who knew the mission.',
      'Décor spend went down. In-kind support went up. Net revenue rose thirty percent, and the board chair — for the first time in six years — ate dinner.',
    ],
    quote: 'They treated our fundraising goal like a design constraint. That changed everything.',
    attribution: 'Priya Venkatesan — Executive Director',
  },
]

/* ─────────────────────────  About page  ───────────────────────── */

export const ABOUT_TENETS = [
  { label: 'Mission', title: 'Design celebrations that feel unmistakably personal.', body: 'We translate a family’s story into a room, a menu and a sequence of moments — then produce it without drama. The measure of our work is whether guests say it felt like you.' },
  { label: 'Vision', title: 'To be the studio people trust with the moments that matter most.', body: 'Not the biggest planner in the region. The one that gets called for the fiftieth, the wedding, and the foundation gala — because the first time went right.' },
  { label: 'Philosophy', title: 'Restraint is a luxury. So is calm.', body: 'One strong idea, executed completely, beats five competing ones. We would rather spend the budget on three things guests remember than twenty they never notice.' },
]

export const ABOUT_VALUES = [
  { num: '01', title: 'Listen first, design second', body: 'The discovery conversation is the longest meeting we have. Everything downstream depends on getting it right.' },
  { num: '02', title: 'Say the honest number', body: 'We price early and revise openly. If something is not worth the money, we will tell you before you spend it.' },
  { num: '03', title: 'Sweat the invisible', body: 'Load-in routes, vendor meals, power draw, the walk from parking to door. Guests feel these even when they never see them.' },
  { num: '04', title: 'Protect the host', body: 'You should not be answering questions during your own toast. Every question routes to us on event day.' },
  { num: '05', title: 'Leave the venue better', body: 'Respect for spaces, staff and neighbours. It is why we get invited back to rooms that rarely say yes twice.' },
]

export const ABOUT_STEPS = [
  { num: '01', title: 'Discovery', body: 'A long conversation about the people, the guest list and what would make the night feel like a success.', when: 'Week 1' },
  { num: '02', title: 'Concept & budget', body: 'A written point of view: palette, layout, guest journey, and a line-item budget with real numbers.', when: 'Weeks 2–4' },
  { num: '03', title: 'Design & sourcing', body: 'Venue, vendors, rentals and menu locked. Mockups for anything we have not built before.', when: 'Months 2–4' },
  { num: '04', title: 'Production', body: 'Run of show, floor plans, rehearsals and vendor briefings. Contingencies written down, not assumed.', when: 'Final 6 weeks' },
  { num: '05', title: 'Event day', body: 'Our team leads load-in, cues the evening and stays through strike. You arrive as a guest.', when: 'The day' },
]

export const ABOUT_CHOOSES = [
  'A single lead planner from first call to final invoice',
  'Written design direction before a dollar is committed',
  'Transparent, itemised budgets — revised in the open',
  'A vendor network we have worked beside for years',
  'Minute-by-minute run of show shared with everyone',
  'A capped number of events per season, on purpose',
]

/* ─────────────────────────  Contact  ───────────────────────── */

export const EVENT_TYPES = ['Birthday', 'Wedding', 'Anniversary', 'Social Event', 'Entertainment', 'Nonprofit Event']

export const BUDGET_RANGES = [
  { value: '', label: 'Select a range' },
  { value: 'under-15', label: 'Under $15,000' },
  { value: '15-40', label: '$15,000 – $40,000' },
  { value: '40-100', label: '$40,000 – $100,000' },
  { value: '100-plus', label: '$100,000+' },
  { value: 'unsure', label: 'Not sure yet' },
]
