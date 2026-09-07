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
    kicker: 'At home or at the hall',
    lede: 'Birthday parties for every age, from a first birthday to a seventieth.',
    body: 'A good birthday is specific. We build the day around the person being celebrated: the food they actually like, the music they grew up on, the friends who need to sit together. First birthdays in backyards, sweet sixteens in small halls, fiftieths in the family dining room, across Scarborough, Markham and the rest of the GTA.',
    included: [
      'Theme, colours and guest list',
      'Venue or at-home layout planning',
      'Catering, bar and cake coordination',
      'Décor, balloons and table styling',
      'Invitations and RSVPs',
      'Setup, hosting and cleanup',
    ],
    options: [
      'DJ, live music or a photo booth',
      'Menu and cake tastings',
      'Photography',
      'Games and kids’ entertainment',
    ],
    faqs: [
      { q: 'How far ahead should we book?', a: 'Six to eight weeks is comfortable for a party of forty at home. For a hall on a summer weekend, give us about three months.' },
      { q: 'Do you plan children’s parties?', a: 'Yes, from first birthdays through sweet sixteens. We keep the schedule tight enough for the kids and the food good enough for the adults.' },
      { q: 'Can you work with the space we already have?', a: 'Usually that is the whole job. Backyards, condo party rooms, community halls and banquet rooms all work. We plan around what the space can actually do.' },
    ],
    cta: 'Plan a birthday',
    image: G('birthday-balloons'),
    alt: 'Balloons floating at a birthday celebration',
  },
  {
    id: 'anniversaries',
    num: '02',
    title: 'Anniversaries',
    kicker: 'Marking the years',
    lede: 'Anniversary parties, from a dinner for twelve to a hall full of family.',
    body: 'Anniversaries get less attention than they deserve. A tenth is worth more than a dinner reservation, and a fiftieth is worth a room that tells the story. We plan both, often with old photographs, family speeches and a menu that goes back to the original wedding.',
    included: [
      'A plan built around the couple’s story',
      'Venue, catering and bar coordination',
      'Florals, lighting and table styling',
      'Speeches and running order',
      'Invitations and guest updates',
      'On-site coordination',
    ],
    options: [
      'Vow renewal ceremony',
      'Photo display or slideshow',
      'Live music or a dance lesson',
      'Guest book or letters from the family',
    ],
    faqs: [
      { q: 'Can you plan a surprise?', a: 'Often, and we are good at it. We handle the cover story, the timing and the arrival. Discretion is part of the job.' },
      { q: 'Do you do smaller dinners?', a: 'Yes. Some of our favourite work has been twelve people around one table.' },
      { q: 'Can the family help plan it?', a: 'Absolutely. We often work with adult children as the clients while the couple stays in the dark.' },
    ],
    cta: 'Plan an anniversary',
    image: G('crystal-glassware'),
    alt: 'Crystal glassware on an elegant table',
  },
  {
    id: 'weddings',
    num: '03',
    title: 'Weddings',
    kicker: 'Planning & day-of coordination',
    lede: 'Wedding planning and day-of coordination, from the first walkthrough to the last dance.',
    body: 'We take a small number of weddings a year so each one gets real attention. Most are banquet hall receptions around Markham and Scarborough, including the convention centres, alongside backyard and outdoor ceremonies. You get one planner who knows your family by name and a budget you can actually follow.',
    included: [
      'Budget planning and payment tracking',
      'Venue and vendor selection',
      'Floor plan, seating and stationery',
      'Décor and florals',
      'Rehearsal and ceremony coordination',
      'Wedding-day management from setup to cleanup',
    ],
    options: [
      'Welcome party or next-day brunch',
      'Guest transport and hotel blocks',
      'Cultural and multi-faith ceremonies',
      'Day-of coordination only',
    ],
    faqs: [
      { q: 'Can we hire you just for the day?', a: 'Yes, and plenty of couples do. You book the vendors, we run the day so your family is not chasing the caterer during cocktail hour.' },
      { q: 'Which venues do you work in?', a: 'Banquet halls around Markham and Scarborough, including the Markham and Scarborough convention centres, plus small halls, community centres, backyards and outdoor sites. Somewhere new to us is fine.' },
      { q: 'Do you travel outside the GTA?', a: 'We plan anywhere in the GTA at no travel charge. Further out is possible, but we will be straight with you about whether it makes sense.' },
      { q: 'How many meetings should we expect?', a: 'Usually six to eight across the engagement, plus email whenever you need it.' },
    ],
    cta: 'Enquire about your date',
    image: G('wedding-couple'),
    alt: 'Couple on their wedding day',
  },
  {
    id: 'corporate',
    num: '04',
    title: 'Corporate Events',
    kicker: 'Lunches, socials & staff days',
    lede: 'Corporate lunches, happy hours, holiday parties and staff appreciation days.',
    body: 'Most companies do not need a production company. They need someone to book the room, sort the food, and make sure forty people can eat inside an hour without the office manager missing lunch. We plan team lunches, after-work socials, client happy hours, holiday parties and appreciation days in restaurants, on patios, in offices and in banquet halls across the GTA.',
    included: [
      'Brief, budget and headcount',
      'Venue and restaurant sourcing',
      'Catering, bar and dietary needs',
      'Room layout and basic AV',
      'Invitations, RSVPs and name badges',
      'On-site management through cleanup',
    ],
    options: [
      'Bar package and drink tickets',
      'Branded signage and printed menus',
      'Awards, gifts and takeaways',
      'Photography',
    ],
    faqs: [
      { q: 'Do you work with our office team?', a: 'Constantly. Most of our corporate work runs beside an office manager or an HR lead. We take the sourcing and the vendor chasing off their desk.' },
      { q: 'What size events do you take?', a: 'From a team lunch for fifteen to a holiday party for a hundred and fifty. Below fifteen we will usually just point you at a good restaurant.' },
      { q: 'How do contracts and invoicing work?', a: 'We can contract directly or go through your procurement process. One consolidated invoice and vendor insurance certificates either way.' },
    ],
    cta: 'Plan a corporate event',
    image: G('raising-glasses'),
    alt: 'Colleagues raising glasses at an after-work social',
  },
  {
    id: 'social',
    num: '05',
    title: 'Social Events',
    kicker: 'Patios, backyards & gatherings',
    lede: 'Patio parties, backyard gatherings, showers, reunions and graduations.',
    body: 'The social calendar is where families actually live. A graduation lunch gets the same planning as a wedding: a clear schedule, vendors we trust, and a host who gets to sit down and eat. A lot of this work happens outdoors, on patios and in backyards, which brings its own problems. Shade, power, parking, weather, and where the food gets prepped.',
    included: [
      'Theme and layout planning',
      'Venue, patio or backyard setup',
      'Catering, rentals and staffing',
      'Décor and table styling',
      'Invitations, RSVPs and signage',
      'Day-of coordination',
    ],
    options: [
      'Bar service and a bartender',
      'Games, music or entertainment',
      'Kids’ table and childcare',
      'Tents, heaters and outdoor rentals',
    ],
    faqs: [
      { q: 'Do you plan events at home?', a: 'Frequently. We handle power, kitchen space, guest flow, parking and the neighbours, which is usually what decides whether a home party works.' },
      { q: 'What is the smallest event you take?', a: 'About twenty guests for full planning. Below that we usually offer styling and vendor sourcing instead.' },
      { q: 'What happens if it rains?', a: 'Every outdoor event gets a wet-weather plan: a tent on hold, an indoor backup, and a set time for making the call.' },
    ],
    cta: 'Plan a gathering',
    image: G('social-guests'),
    alt: 'Guests in conversation at a social event',
  },
  {
    id: 'nonprofit',
    num: '06',
    title: 'Nonprofit Events',
    kicker: 'Charities & community',
    lede: 'Fundraisers, book fairs, community days and volunteer appreciation nights.',
    body: 'We work with local charities, schools and community groups, usually on a tight budget with a room full of volunteers. Fundraising dinners, book fairs, awareness days, donor thank-you nights and community celebrations. We handle the venue, the vendors and the running order so your team can spend the day talking to the people who showed up.',
    included: [
      'Budget planning and cost control',
      'Venue and permit coordination',
      'Programme and running order',
      'Vendor and rental sourcing',
      'Sponsor and donor recognition',
      'Volunteer briefing and on-site management',
    ],
    options: [
      'Raffle and silent auction setup',
      'Emcee sourcing',
      'Sponsor signage and printed programmes',
      'Photography and post-event thank-yous',
    ],
    faqs: [
      { q: 'Do you offer nonprofit rates?', a: 'Yes. We keep room each year for local causes at a reduced planning fee, and we will help chase donated goods and services.' },
      { q: 'Can you work within a small budget?', a: 'That is most of this work. Tell us the number you have and we will tell you honestly what it will and will not cover.' },
      { q: 'Do you work with volunteer committees?', a: 'Often. We give volunteers clear, bounded jobs and a written schedule, so nobody is standing around wondering what to do.' },
    ],
    cta: 'Plan a fundraiser',
    image: G('gala-toast'),
    alt: 'Guests raising a toast at a fundraising dinner',
  },
]

/* ─────────────────────────  Home page  ───────────────────────── */

export const HERO_META = [
  { label: 'What we plan', value: 'Birthdays · Weddings · Corporate · Community' },
  { label: 'Consultations', value: 'Now booking 2026 dates' },
  { label: 'Service area', value: 'Scarborough, Markham & the GTA' },
]

export const HERO_HIGHLIGHTS = {
  primary: {
    image: G('ballroom-styling'),
    alt: 'Planners styling a ballroom with florals before guests arrive',
    eyebrow: 'Setup day',
    caption: 'Four hours before doors, 120 guests',
  },
  secondary: {
    image: G('candlelit-table-setting'),
    alt: 'Glassware and candlelight running down a long dinner table',
  },
  tertiary: {
    image: G('ceremony-aisle-florals'),
    alt: 'Rose arrangements lining the aisle at an outdoor ceremony',
  },
}

export const DISCIPLINE_MARQUEE = SERVICES.map((s) => s.title)

export const STUDIO_PILLARS = [
  { title: 'Personal by default', body: 'No set packages. We plan around your day.' },
  { title: 'Detail that holds up', body: 'Timelines, rentals and setup times, written down and checked.' },
  { title: 'Honest budgets', body: 'Real numbers early, no surprises at the end.' },
  { title: 'Calm on the day', body: 'You get to be a guest at your own party.' },
]

export const REASONS = [
  { num: '01', title: 'Personalised planning', body: 'One planner from the first call to the last invoice. The person who heard your ideas is the person running your day.' },
  { num: '02', title: 'Ideas that fit the room', body: 'Colours, layout and lighting planned together, so the space reads as one idea instead of a pile of rentals.' },
  { num: '03', title: 'Coordination that holds', body: 'A written schedule every vendor has a copy of, and a walkthrough for anything with moving parts.' },
  { num: '04', title: 'Vendors we trust', body: 'Caterers, florists, DJs and rental companies we have worked with for years, who pick up the phone when we call.' },
  { num: '05', title: 'Guests who feel looked after', body: 'We plan the arrival, the seating and the goodbye, because those are the parts guests remember.' },
  { num: '06', title: 'The boring parts handled', body: 'Permits, insurance, parking, power and rain plans sorted in the background.' },
  { num: '07', title: 'Comfortable in an office', body: 'Corporate clients get the same planner plus the paperwork finance wants: one invoice, vendor certificates, and a schedule that fits on a page.' },
  { num: '08', title: 'One team for every occasion', body: 'The family that booked us for a fiftieth calls back for the office holiday lunch. Six kinds of event, one set of vendors, and nobody has to re-explain how you like things done.' },
]

export type Testimonial = { quote: string; author: string; role: string }

// TODO: placeholder quotes from the original build. Replace with real client
// testimonials (and real names, with permission) before launch.
export const TESTIMONIALS: Testimonial[] = [
  { quote: 'We came in with a spreadsheet and a lot of nerves. FunGen turned it into a day our families still talk about, and they never once made us feel rushed or upsold.', author: 'Amara & Daniel R.', role: 'Wedding, 120 guests, Markham' },
  { quote: 'Our fundraiser started on time for the first time in years, and our volunteers actually got to sit down and eat.', author: 'Priya Venkatesan', role: 'Northgate Youth Foundation' },
  { quote: 'Our staff lunch used to eat a week of my time. This year I showed up, ate with everyone, and went back to work.', author: 'Dana Whitcombe', role: 'Office manager, appreciation lunch for 60' },
  { quote: 'My mother has never once been surprised in her life. She cried in the doorway. That is the whole review.', author: 'Marcus Whitfield', role: '70th birthday at home, Scarborough' },
]

/* ─────────────────────────  Portfolio  ───────────────────────── */

export type PortfolioItem = {
  cat: string
  tag: string
  title: string
  meta: string
  year: string
  image: string
  ratio: 'portrait' | 'square' | 'wide'
  alt: string
}

// TODO: placeholder projects from the original build. Swap in the client's real
// events, guest counts and photographs before launch.
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { cat: 'Weddings', tag: 'Wedding', title: 'A Banquet Hall Wedding in Markham', meta: '140 guests · a Saturday in July', year: '2026', image: G('wedding-hall-tables'), ratio: 'wide', alt: 'Round tables and gold chiavari chairs set for a wedding reception' },
  { cat: 'Nonprofit', tag: 'Book Fair', title: 'The Spring Book Fair', meta: '1,400 titles · a spring weekend in Scarborough', year: '2025', image: G('book-fair-tables'), ratio: 'wide', alt: 'Shoppers browsing long tables of second-hand books at a book fair' },
  { cat: 'Birthdays', tag: 'Birthday', title: 'A Backyard Birthday in West Hill', meta: '38 guests · a back deck and a rented marquee', year: '2025', image: G('birthday-home-deck'), ratio: 'portrait', alt: 'Happy birthday bunting and string lights over a back deck' },
  { cat: 'Nonprofit', tag: 'Community Day', title: 'Neighbourhood Day in Malvern', meta: '120 guests · a community centre hall', year: '2026', image: G('community-workshop'), ratio: 'portrait', alt: 'Neighbours working along a long table at a community centre' },
  { cat: 'Corporate', tag: 'Client Lunch', title: 'The Year-End Client Lunch', meta: '26 guests · a private dining room in Markham', year: '2025', image: G('corporate-lunch-table'), ratio: 'portrait', alt: 'Plated lunch being set down at a long restaurant table' },
]


export const PORTFOLIO_STORIES = [
  {
    index: '01',
    title: 'A Banquet Hall Wedding in Markham',
    image: G('wedding-hall-tables'),
    imageAlt: 'Round tables and gold chiavari chairs set for a wedding reception',
    imageRatio: 'square' as const,
    imageFirst: true,
    paragraphs: [
      'They booked the hall eleven months out and then spent four of those months worried about the same thing: two families, one seating chart, and a grandmother who could not manage the stairs to the landing.',
      'We moved the receiving line off the landing and into the foyer, seated both families at the two tables closest to the head table instead of splitting the room left and right, and put the bar at the far end so the room filled from the back. Dinner service started nine minutes late and still finished on time.',
    ],
    quote: 'My mother watched the whole night waiting for something to go wrong. She gave up around ten.',
    attribution: 'Wedding for 140, Markham',
  },
  {
    index: '02',
    title: 'The Spring Book Fair',
    image: G('book-fair-tables'),
    imageAlt: 'Shoppers browsing long tables of second-hand books at a book fair',
    imageRatio: 'portrait' as const,
    imageFirst: false,
    paragraphs: [
      'A school parent council with fourteen hundred donated titles, a gym they could only have from Friday afternoon to Sunday night, and no settled idea of how to price any of it.',
      'We sorted the stock by reading level rather than genre, which is how parents actually shop, and put the picture books on low tables where children could reach them. Pricing went flat at two dollars a book or five for three, so the volunteers on the till never had to do arithmetic. Shifts ran two hours each. They sold through about four fifths of the stock and boxed the rest for next spring.',
    ],
    quote: 'We had run this fair for six years and never once finished setting up before the doors opened.',
    attribution: 'Parent council, Scarborough',
  },
  {
    index: '03',
    title: 'A Backyard Birthday in West Hill',
    image: G('birthday-home-deck'),
    imageAlt: 'Happy birthday bunting and string lights over a back deck',
    imageRatio: 'square' as const,
    imageFirst: true,
    paragraphs: [
      'A ninth birthday, thirty-eight people, and a back deck that comfortably holds twelve. The forecast was rain on and off from noon.',
      'We put the marquee over the lawn instead of the deck, which kept the kitchen door clear for food coming out, and ran power from the garage so the urn and the speakers did not trip the house breaker. The cake stayed inside until it was wanted. It rained twice, about ten minutes each time, and nobody moved.',
    ],
    quote: 'I have hosted this party eight times. It was the first one where I sat down.',
    attribution: 'Backyard birthday, West Hill',
  },
]

/* ─────────────────────────  About page  ───────────────────────── */

export const ABOUT_TENETS = [
  { label: 'Mission', title: 'Plan celebrations that feel like the people they are for.', body: 'We turn what a family tells us into a room, a menu and an order of events, then run it without drama. The test is whether guests say it felt like you.' },
  { label: 'Vision', title: 'To be the first call when something matters.', body: 'Not the biggest planner in the GTA. The one a family calls for the fiftieth, then the wedding, then the school fundraiser, because the first one went right.' },
  { label: 'Philosophy', title: 'One good idea beats five competing ones.', body: 'One strong idea, done properly, is worth more than five half-finished ones. We would rather spend the budget on three things guests remember than twenty they never notice.' },
]

export const ABOUT_VALUES = [
  { num: '01', title: 'Listen first, plan second', body: 'The first conversation is the longest meeting we have. Everything after it depends on getting that part right.' },
  { num: '02', title: 'Say the honest number', body: 'We price early and revise in the open. If something is not worth the money, we will say so before you spend it.' },
  { num: '03', title: 'Sweat the invisible', body: 'Setup routes, vendor meals, power draw, and the walk from the parking lot to the door. Guests feel these even when they never notice them.' },
  { num: '04', title: 'Protect the host', body: 'You should not be answering questions during your own speech. On the day, every question comes to us.' },
  { num: '05', title: 'Leave the venue better', body: 'Respect for the space, the staff and the neighbours. It is why halls that rarely say yes twice keep inviting us back.' },
]

export const ABOUT_STEPS = [
  { num: '01', title: 'First conversation', body: 'A long talk about the people, the guest list and what would make the day feel like it worked.', when: 'Week 1' },
  { num: '02', title: 'Plan and budget', body: 'A written plan: layout, colours, order of events, and a line-by-line budget with real numbers.', when: 'Weeks 2–4' },
  { num: '03', title: 'Booking and sourcing', body: 'Venue, vendors, rentals and menu locked in. A mock-up for anything we have not built before.', when: 'Months 2–3' },
  { num: '04', title: 'Run of show', body: 'Schedules, floor plans, walkthroughs and vendor briefings. Backup plans written down instead of assumed.', when: 'Final 4 weeks' },
  { num: '05', title: 'Event day', body: 'We lead setup, run the day and stay through cleanup. You arrive as a guest.', when: 'The day' },
]

export const ABOUT_CHOOSES = [
  'One planner from the first call to the last invoice',
  'A written plan before you commit a dollar',
  'Itemised budgets, revised in the open',
  'Vendors we have worked beside for years',
  'A schedule every vendor has in writing',
  'A few events at a time, so yours gets attention',
]

/* ─────────────────────────  Contact  ───────────────────────── */

/**
 * Service area grouped by direction from the Scarborough base — drives the
 * About page's service-area columns. Single source of truth for the city list.
 */
export const SERVICE_AREA_GROUPS = [
  { direction: 'East', cities: ['Scarborough', 'Pickering', 'Ajax'] },
  { direction: 'North', cities: ['Markham', 'Richmond Hill', 'Vaughan'] },
  { direction: 'West', cities: ['Toronto', 'Mississauga', 'Brampton', 'Oakville'] },
]

/** The one city we are based in — marked out in the service-area columns. */
export const HOME_BASE_CITY = 'Scarborough'

/**
 * Flat list of the municipalities above — rendered as the service-area line in
 * the footer and on the contact page, and mirrored in the LocalBusiness JSON-LD
 * `areaServed` in lib/metadata.ts. Derived so the two never drift apart.
 */
export const SERVICE_AREA_CITIES = SERVICE_AREA_GROUPS.flatMap((group) => group.cities)

export const EVENT_TYPES = ['Birthday', 'Anniversary', 'Wedding', 'Corporate Event', 'Social Event', 'Nonprofit Event']

export const BUDGET_RANGES = [
  { value: '', label: 'Select a range' },
  { value: 'under-2500', label: 'Under $2,500' },
  { value: '2500-7500', label: '$2,500 – $7,500' },
  { value: '7500-15000', label: '$7,500 – $15,000' },
  { value: '15000-plus', label: '$15,000+' },
  { value: 'unsure', label: 'Not sure yet' },
]
