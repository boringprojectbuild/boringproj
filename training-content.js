const TRAINING_MODULES = {
  module1: {
    title: "The Big Picture",
    lesson: [
      { heading: "1.1 — The problem we exist to fix", body: "San Antonio is full of businesses doing genuinely excellent work who are completely invisible online — not because the work is bad, but because nobody built them a working web presence. 97% of people search online before ever calling a local business. If a business isn't on page one, they don't exist to that searcher. Not a quality problem — a visibility problem, and visibility is fixable." },
      { heading: "1.2 — Who we are and why it matters that Joseph built this", body: "Joseph Gutierrez is a San Antonio native who built boring project. specifically for local service businesses. Reps should sound like they actually know this city, not read a script." },
      { heading: "1.3 — What we actually do (in one breath)", body: "We build and manage a business's entire online presence — website, GBP, local rankings — every month, ongoing. Most competitors build a site once and disappear. We build it and keep it working. That distinction is the core pitch, compressed." },
      { heading: "1.4 — Mission and tagline", body: "Mission: \"Get boring businesses found.\" Tagline: \"Finally found.\"" },
      { heading: "1.5 — Brand voice", body: "Straight talk, no jargon, confident (never hedging), local and specific. Never say: \"synergy,\" \"leverage,\" \"game changer,\" \"guru.\" If it sounds like a template, it's wrong." }
    ],
    quiz: [
      {
        question: "A prospect asks, \"So what exactly do you guys do?\" What's the strongest one-breath answer?",
        options: [
          { text: "\"We're a digital marketing agency specializing in SEO optimization solutions.\"", correct: false, rationale: "This sounds like every other agency's cold call opener — jargon-heavy, doesn't differentiate." },
          { text: "\"We build your website and manage your Google presence every month, so you keep showing up instead of going stale.\"", correct: true, rationale: "This is right because it names both halves of the value — the build AND the ongoing management — in plain language. That \"every month\" detail is what separates us from a one-time-build agency." },
          { text: "\"We do websites.\"", correct: false, rationale: "Technically true but dramatically incomplete — it omits the management/ongoing side, which is the actual differentiator." },
          { text: "\"We help with your online marketing strategy.\"", correct: false, rationale: "Too vague to mean anything — a prospect has heard this from five agencies already and tuned out." }
        ]
      },
      {
        question: "Why does it matter that a business isn't ranking on Google, according to the \"97%\" stat?",
        options: [
          { text: "Because Google charges businesses that don't rank.", correct: false, rationale: "There's no such charge — this confuses a search ranking with a paid product." },
          { text: "Because most people research online before ever calling, so an invisible business loses the call before the phone even rings.", correct: true, rationale: "Exactly right — the 97% stat is about buyer behavior, not technology. The call is already decided before the prospect picks up the phone." },
          { text: "Because it means their website is broken.", correct: false, rationale: "Not ranking and having a broken site are different problems — a site can be functional and still not rank." },
          { text: "Because it affects their business license.", correct: false, rationale: "Completely unrelated — licensing has nothing to do with search visibility." }
        ]
      },
      {
        question: "Which of these best reflects boring project's actual differentiator versus a typical competitor?",
        options: [
          { text: "We're cheaper.", correct: false, rationale: "Price is a real advantage but not the core differentiator — a competitor could drop price and erase that gap." },
          { text: "We use AI.", correct: false, rationale: "Never say this to a lead or client, per company policy. Also not the differentiator that matters to the prospect." },
          { text: "We build it AND manage it monthly, instead of building once and disappearing.", correct: true, rationale: "This is the real structural difference — most competing agencies are one-time-build shops. The ongoing monthly management is what keeps a site ranking instead of going stale." },
          { text: "We only work with home service businesses.", correct: false, rationale: "Too narrow — we work with local service businesses broadly (HVAC, plumbing, roofing, landscaping, pest control, cleaning, demolition, etc.)." }
        ]
      },
      {
        question: "Which phrase fits the boring project brand voice?",
        options: [
          { text: "\"This is a real game changer for your business.\"", correct: false, rationale: "\"Game changer\" is explicitly on the banned phrase list." },
          { text: "\"Honestly, if I'm being real with you, most businesses like yours are losing calls to competitors who just show up first on Google.\"", correct: true, rationale: "This is the voice — conversational, direct, uses natural filler phrases, states a specific consequence rather than a vague benefit." },
          { text: "\"Our synergistic approach leverages proven SEO methodologies.\"", correct: false, rationale: "Corporate jargon — the opposite of straight talk." },
          { text: "\"Hey guys!!! Excited to share our services!!!\"", correct: false, rationale: "Too high-energy and generic — doesn't sound like a real SA local talking to a business owner." }
        ]
      },
      {
        question: "True or False: Since we build websites, our core pitch should center on our web design skill and portfolio.",
        options: [
          { text: "True", correct: false, rationale: "This misses the actual value proposition. Plenty of competitors can build a decent-looking site. Design is a means to the outcome, not the pitch itself." },
          { text: "False", correct: true, rationale: "False is right — the core pitch centers on visibility and the ongoing management relationship, not design craft. A prospect cares about the phone ringing far more than design aesthetics." }
        ]
      }
    ]
  },

  module2: {
    title: "Speak the Language",
    lesson: [
      { heading: "2.1 — GBP (Google Business Profile)", body: "Free listing on Google Maps and the \"local pack.\" Highest-leverage free asset a local business has, most barely touch it. If asked: \"It's basically your business's ID card on Google Maps — hours, photos, reviews, all in one spot. If it's incomplete or stale, Google trusts it less, and trusts you less.\"" },
      { heading: "2.2 — SEO (Search Engine Optimization)", body: "The overall practice of making a site/presence something Google wants to rank highly — dozens of small factors (speed, content, structure, backlinks, reviews, GBP activity) working together over time. Analogy: \"Think of Google like a really strict maître d'. SEO is basically making sure your restaurant looks legit enough that they seat you near the front instead of hiding you in the back.\"" },
      { heading: "2.3 — NAP (Name, Address, Phone) Consistency", body: "Name/address/phone must match character-for-character across every directory. Mismatches confuse Google about whether it's the same business, hurting rankings. Analogy: \"If your business info is listed slightly different everywhere online, Google gets confused about whether it's even the same business — kind of like if your mail went to five slightly different addresses. Some of it just doesn't arrive.\"" },
      { heading: "2.4 — Citations", body: "Any online mention of a business's NAP info — Yelp, BBB, MapQuest, ZoomInfo, industry directories. More consistent citations = more trust signals to Google." },
      { heading: "2.5 — Schema Markup", body: "Invisible code telling Google explicitly what things are (\"this is a local business,\" \"this is a service\") instead of making Google guess. Plain-English: labeling boxes before movers show up, instead of making them guess what's inside." },
      { heading: "2.6 — GSC (Google Search Console)", body: "Google's free diagnostic tool — shows what people searched before landing on the site, what's indexed, crawl errors. Tells you WHY something is or isn't ranking." },
      { heading: "2.7 — KPIs (Key Performance Indicators)", body: "The numbers used to prove progress in the monthly report — ranking position, GBP calls/direction requests, traffic, review count. Turns \"trust us\" into \"here's the number that moved.\"" },
      { heading: "2.8 — Local Pack", body: "The map + 3 business listings at the top of a local Google search. One of the highest-value outcomes in local SEO — prime real estate above regular results." },
      { heading: "2.9 — Backlinks (Organic vs. Paid)", body: "A backlink is any other site linking back to a business's site — a vote of credibility. Organic backlinks happen naturally/get earned — local news, chamber of commerce, free directories like Yelp/BBB/Alignable listing and linking back. These are free, legitimate, and what boring project. focuses on. Paid backlinks are bought directly, often through shady link-selling networks — a black-hat tactic Google actively penalizes. Not something we do or recommend. Why it matters to the client: We build organic backlinks as a natural byproduct of proper citation cleanup on free, reputable directories — not risky paid schemes that can get a site penalized. Analogy: \"Organic backlinks are like getting a genuine recommendation from someone in the community — it actually means something. Paid backlinks are like paying a stranger to say they know you. Google's gotten really good at spotting the difference, and it punishes the second one.\" If asked \"can you help with backlinks?\": \"Yeah — as part of getting you listed properly across places like Yelp, BBB, and other trusted directories, you naturally pick up real backlinks. We don't do the paid, risky stuff that can actually get you penalized.\"" }
    ],
    quiz: [
      {
        question: "A prospect asks what \"GBP\" means. What's the correct, sellable answer?",
        options: [
          { text: "A payment processor for Google Ads.", correct: false, rationale: "No such Google product tied to this term." },
          { text: "Google's free business listing that shows up on Maps and local search results.", correct: true, rationale: "GBP is a free listing, not a paid product, shows up on Maps and local search. Core to every tier's work." },
          { text: "A type of website hosting plan.", correct: false, rationale: "GBP has nothing to do with hosting (Netlify is hosting) — separate thing entirely." },
          { text: "Google's paid advertising platform.", correct: false, rationale: "Confuses GBP with Google Ads (paid). GBP itself is free — part of why it's high-leverage, underused." }
        ]
      },
      {
        question: "Why does NAP consistency actually matter for rankings?",
        options: [
          { text: "It doesn't affect rankings, only reviews.", correct: false, rationale: "NAP is a real, direct local ranking factor, not just cosmetic." },
          { text: "Inconsistent info across directories confuses Google about whether listings refer to the same business, which weakens trust and rankings.", correct: true, rationale: "Google verifies legitimacy via consistency — mismatches introduce doubt. Citation cleanup (fixing NAP everywhere) is a core deliverable." },
          { text: "It only matters for businesses with multiple locations.", correct: false, rationale: "Matters for every business, single-location or not." },
          { text: "NAP consistency is a one-time fix that never needs revisiting.", correct: false, rationale: "Needs active monitoring — new directories appear, old dead links linger unless caught. This is ongoing monthly work." }
        ]
      },
      {
        question: "What's the best plain-English way to explain \"SEO\" to a prospect who's never heard the term?",
        options: [
          { text: "\"It's a complicated technical algorithm thing, don't worry about it.\"", correct: false, rationale: "Waving it off undersells the value of what we actually do." },
          { text: "\"It's everything that goes into making Google trust your business enough to show it first when people search.\"", correct: true, rationale: "Captures the real meaning without jargon — the sum of trust/relevance signals determining ranking." },
          { text: "\"It's just having a website.\"", correct: false, rationale: "Having a site and ranking well are different — plenty of businesses have live sites that still don't rank." },
          { text: "\"It's paying Google for ads.\"", correct: false, rationale: "Confuses SEO (organic/free) with paid advertising, a different product we don't sell." }
        ]
      },
      {
        question: "A client asks how you'll prove the work is actually doing something. What's the correct term for the numbers used to show that?",
        options: [
          { text: "NAP", correct: false, rationale: "NAP is about listing consistency, not performance tracking." },
          { text: "Schema", correct: false, rationale: "Schema is technical setup, not a reporting metric." },
          { text: "KPIs", correct: true, rationale: "KPIs are the proof mechanism — ranking positions, GBP calls, traffic, review count. Directly tied to the monthly report, the retention weapon." },
          { text: "Backlinks", correct: false, rationale: "Backlinks are one input that can influence rankings, not the reporting framework itself." }
        ]
      },
      {
        question: "What is the \"local pack\"?",
        options: [
          { text: "A discount pricing bundle for local businesses.", correct: false, rationale: "Not a pricing concept." },
          { text: "The map plus three business listings that appear at the top of local Google searches.", correct: true, rationale: "The map-plus-three-listings block at the top of local search, above organic results. Getting a client into it is a clear, valuable win." },
          { text: "A group of local competitors.", correct: false, rationale: "Not what the term refers to — though competitors often occupy those spots, ironically." },
          { text: "The directory listings a business appears in.", correct: false, rationale: "Confuses local pack with citations/directory listings — separate concepts." }
        ]
      }
    ]
  },

  module3: {
    title: "What We Actually Build",
    lesson: [
      { heading: "3.1 — The website build itself", body: "Custom sites — homepage, about, individual pages per service, per service area/zip code, contact, blog. Not a template. Every page targets a specific search. Why it matters: More pages targeting specific searches = more ways to get found. A generic homepage can't compete with a dedicated \"water heater repair 78230\" page. Analogy: \"A one-page website is like one fishing line in the water. We're putting out fifty lines, each one baited for a different search.\"" },
      { heading: "3.2 — Speed (PageSpeed 90+)", body: "Google factors load speed into rankings; slow sites lose visitors before they even see it. 90+ score = fast on desktop and mobile. Why it matters: A 6-second load loses most visitors before the page finishes — a lead gone before they see the phone number." },
      { heading: "3.3 — Schema markup, in practice", body: "Labels business type, services, service areas, reviews in code Google reads directly, instead of guessing. Why it matters: Difference between Google confidently understanding \"this is a demolition contractor in San Antonio\" versus guessing wrong or not showing up for the right searches." },
      { heading: "3.4 — Mobile-first, technical SEO basics", body: "Mobile-first build (most local searches happen on phone), title tags/meta descriptions/H1 headers targeting local keywords on every page — basic scaffolding Google needs to understand and rank a page at all." },
      { heading: "3.5 — GBP overhaul", body: "Full completion of every field, verification, dead links removed/replaced, active weekly posting cadence. Why it matters: An incomplete, inactive GBP signals the business might not be operating. Free real estate most competitors leave empty." },
      { heading: "3.6 — Citation cleanup", body: "Submission/correction across top 10-15+ directories so NAP is consistent, dead/old links replaced with the new live site. Why it matters: Fixes the \"every directory links to a dead page\" problem. This is also where organic backlinks (Module 2) come from — proper directory listings naturally build real backlinks as a byproduct." },
      { heading: "3.7 — Analytics, Search Console, monitoring", body: "Installed/verified on every build — powers the monthly report (traffic, keyword impressions, crawl errors), lets us prove progress with real numbers." },
      { heading: "3.8 — The 7-business-day build promise, and the \"how do you build so fast\" answer", body: "Once all content is received, site is live in 7 business days — vs. 4-8 weeks for a traditional agency. Clock starts the day we have everything needed. Approved answer to \"how do you build so fast?\": \"Honestly, it comes down to process. Traditional agencies have layers — account managers, revision rounds, internal meetings before anything actually gets built. We cut all of that out. It's a tight, refined workflow built specifically for local service businesses, so we're not starting from zero on every project. Same way a contractor with a dialed-in process and better tools gets a job done faster than one that's disorganized — the skill and the craftsmanship don't change. We just don't waste motion.\" Never mention AI. Ever." }
    ],
    quiz: [
      {
        question: "Why do we build 50+ pages instead of one homepage?",
        options: [
          { text: "More pages means a higher price we can charge.", correct: false, rationale: "Frames it as padding for profit — inaccurate, page count is a ranking strategy function." },
          { text: "Each page targets a specific search, so more pages means more ways to actually get found.", correct: true, rationale: "Specificity ranks. A dedicated page competes for an exact search in a way a generic homepage can't." },
          { text: "Google requires a minimum page count to rank at all.", correct: false, rationale: "No such Google rule." },
          { text: "It's just a design preference.", correct: false, rationale: "Undersells it as aesthetic when it's a core SEO strategy." }
        ]
      },
      {
        question: "A prospect asks why site speed matters. What's the correct answer?",
        options: [
          { text: "It only affects how the site looks, not rankings or visitors.", correct: false, rationale: "Drastically understates it — speed is functional and ranking-relevant, not cosmetic." },
          { text: "Slow sites lose visitors before they even load, and Google factors speed into rankings.", correct: true, rationale: "Both a real ranking factor AND a real visitor-loss problem. Google penalizes slow sites, and real humans leave before a slow site even finishes loading." },
          { text: "Site speed only matters for e-commerce websites.", correct: false, rationale: "Matters for every website — someone searching urgently on their phone is even less patient with a slow load." },
          { text: "Speed is fixed automatically by Google, we don't need to build for it.", correct: false, rationale: "Google doesn't fix a slow site automatically — the build itself achieves the score." }
        ]
      },
      {
        question: "What happens if a rep is asked \"how do you build sites so fast?\"",
        options: [
          { text: "Explain that AI tools speed up the build process.", correct: false, rationale: "Directly violates the hard company rule — AI must never be mentioned to leads or clients, in any form." },
          { text: "Say it comes down to a refined process — no agency bloat or approval layers, a tight workflow built specifically for this kind of client — same skill, less wasted motion.", correct: true, rationale: "Actually answers the question with a real, honest cause instead of just restating the claim, without naming a tool or method needing confidentiality." },
          { text: "Explain the exact software and tools used.", correct: false, rationale: "Not necessary and risks veering toward proprietary/AI territory." },
          { text: "Deflect the question entirely and change the subject.", correct: false, rationale: "Reads as evasive. There IS an approved, confident answer — use it, don't avoid the question." }
        ]
      },
      {
        question: "Why does citation cleanup matter, using the Maximum Demo audit as an example?",
        options: [
          { text: "It's a cosmetic detail with no real impact on the business.", correct: false, rationale: "Flagged as one of the most critical findings in the actual audit." },
          { text: "Every directory (Yelp, BBB, GBP, etc.) was linking to their suspended website, which meant every single potential click hit a dead page.", correct: true, rationale: "This was the real finding — Maximum Demo's suspended site meant every directory listing funneled clients to an error page. A powerful real example reps can reference." },
          { text: "It only matters for businesses with bad reviews.", correct: false, rationale: "Citation issues are independent of review quality." },
          { text: "Citation cleanup is optional and rarely affects a business.", correct: false, rationale: "Core deliverable with real, measurable impact." }
        ]
      },
      {
        question: "What's the connection between citation cleanup (3.6) and organic backlinks (Module 2)?",
        options: [
          { text: "They're unrelated — citations and backlinks are two totally separate services.", correct: false, rationale: "Directly connected, not separate." },
          { text: "Getting listed properly on trusted, free directories during citation cleanup is itself how organic backlinks get built.", correct: true, rationale: "Proper directory listings themselves function as organic backlinks — one process produces the other as a natural result." },
          { text: "Citation cleanup replaces the need for backlinks entirely.", correct: false, rationale: "Citation cleanup is one legitimate organic source of backlinks, not a substitute for the broader concept." },
          { text: "Backlinks are only built through paid advertising, not citation work.", correct: false, rationale: "Backwards — boring project. specifically avoids paid/black-hat backlink schemes." }
        ]
      }
    ]
  },

  module4: {
    title: "The Three Tiers",
    lesson: [
      { heading: "4.1 — Tiers solve different starting problems, not \"more of the same\"", body: "Visibility ($299/mo): \"You already have a website — why isn't anyone finding it?\" Foundation ($599/mo): \"You don't have a working website at all — where do we even start?\" Dominate ($999/mo): \"You're already visible — how do we take market share from named competitors?\"" },
      { heading: "4.2 — Visibility ($299/mo)", body: "GBP optimization, citation cleanup, review building, monthly reporting. No website build. Only works if the business already has a live, functioning site. The trap: $299 sounds like the \"safe\" entry point, but if a prospect has no live site (like Maximum Demo), Visibility structurally cannot deliver. Pitching it anyway isn't a discount — it sets the client up to pay for something that can't work." },
      { heading: "4.3 — Foundation ($599/mo)", body: "Everything in Visibility, plus full website build — 50+ pages, schema, PageSpeed 90+, complete local SEO architecture. Right starting point for no-site/dead-site/outdated-site businesses. Default recommendation for most new clients." },
      { heading: "4.4 — Dominate ($999/mo)", body: "Everything in Foundation, plus aggressive content strategy, backlink building, competitor gap analysis, entity optimization, weekly reporting. Acceleration point, not a starting point — assumes existing presence to build on." },
      { heading: "4.5 — Never quote exact pricing on a first call", body: "The audit determines fit, not a guess in the first 60 seconds. \"A fraction of what a typical agency charges, no forced contract\" holds the door open until the audit does its job." },
      { heading: "4.6 — The $299 anchor trap", body: "What NOT to do: argue the price is wrong, get defensive, over-explain feature-by-feature. What TO do: redirect to fit, not price. Approved line: \"Totally get it — $299 is the lower number. But that plan's built for businesses that already have a working website and just need help getting found. Right now you don't have that piece yet, so $299 wouldn't actually fix the thing that's costing you calls. Foundation's what gets you the site itself, plus everything Visibility does on top of it — that's really the starting line for where you're at.\" Key move: never argue against the price itself. Argue for fit." },
      { heading: "4.7 — \"Can't I just start on Foundation, then switch down to Visibility later?\"", body: "Real, fair question — technically yes, they could. Honest answer explains why that's bad for the client's success, not just bad for us. Real reasoning: SEO takes 60-120 days to show traction. Foundation's monthly work (months 2-4) is what builds compounding momentum. Downgrading right as that momentum forms stops new page/content growth entirely — Visibility only maintains what exists. Approved answer: \"You could, technically — but here's what actually happens if you do. The site launch just gets you indexed. The real ranking growth happens in the months after, while we're still adding pages and content. If you drop to Visibility right when that's kicking in, you stop that growth right before it pays off — like building a house and stopping before the roof goes on. I'd rather set you up to actually get the result you came here for, then revisit the plan once you're seeing it. Foundation now, reassess once the results are showing — that's the route that actually gets you there.\" Why it matters beyond the sale: A client who downgrades early and doesn't see results churns and blames the product, not the timeline. This protects both the client's outcome and long-term retention numbers." },
      { heading: "4.8 — Quick reference", body: "No website / dead or suspended website → Foundation. Live website, but invisible on Google → Visibility. Already ranking somewhat, wants to beat named competitors → Dominate. Unsure / hasn't been audited yet → Never guess, audit first." }
    ],
    quiz: [
      {
        question: "A prospect has no live website at all — their old site is suspended. Which tier is the correct fit, and why?",
        options: [
          { text: "Visibility, because it's the cheapest starting option.", correct: false, rationale: "Cheapest isn't correct-fit — sets the client up to pay for something structurally incapable of working." },
          { text: "Foundation, because Visibility only optimizes an existing website and there's nothing here to optimize yet.", correct: true, rationale: "Visibility has no website build — without a live site there's nothing for its GBP/citation/review work to point to. Foundation builds the missing piece." },
          { text: "Dominate, because they need to catch up to competitors fast.", correct: false, rationale: "Dominate assumes existing presence to build on." },
          { text: "It doesn't matter which tier, they all include a website build.", correct: false, rationale: "Only Foundation and Dominate include a build — important distinction to have memorized cold." }
        ]
      },
      {
        question: "A prospect says \"I saw you have a $299 plan, I want that one.\" You know they have no working website. Strongest response?",
        options: [
          { text: "\"Sure, we can do $299.\"", correct: false, rationale: "Sells something that structurally can't deliver — sets up an unhappy client who churns." },
          { text: "Argue that $299 is actually not that cheap compared to competitors.", correct: false, rationale: "Argues about price rather than fit — misses the real issue." },
          { text: "Redirect to their specific situation — explain that $299 optimizes an existing site, and since they don't have one yet, it won't fix what's actually costing them calls.", correct: true, rationale: "Never argue against price itself, argue for fit. Honest, specific, naturally leads toward Foundation." },
          { text: "Refuse to discuss pricing at all until they schedule a meeting.", correct: false, rationale: "Refusing to engage on a fair question reads as evasive." }
        ]
      },
      {
        question: "A prospect asks, \"Can't I just sign up for Foundation now and switch down to Visibility later once the site's built?\" Strongest honest answer?",
        options: [
          { text: "\"No, that's not allowed under any circumstances.\"", correct: false, rationale: "Inaccurate — there's no contract lock preventing a tier change; saying so would be dishonest." },
          { text: "\"Sure, that works exactly the same either way.\"", correct: false, rationale: "Untrue and undersells a real, important distinction." },
          { text: "Explain that real ranking growth happens in the months after launch, while Foundation keeps adding pages/content — dropping to Visibility right as that's building would stop the momentum before it pays off.", correct: true, rationale: "Honest — they technically could, but the real timeline/compounding-momentum explanation serves the client's actual outcome." },
          { text: "Avoid answering directly and change the subject.", correct: false, rationale: "A fair, common question deserving a direct answer." }
        ]
      },
      {
        question: "What is Dominate ($999/mo) actually built for?",
        options: [
          { text: "Businesses with no website at all.", correct: false, rationale: "Needs Foundation first." },
          { text: "Businesses that already have some online presence and want to actively outrank named competitors.", correct: true, rationale: "An acceleration tier — competitor gap analysis, content targeting competitor keywords, backlink outreach. Assumes something to build from." },
          { text: "Businesses that want the cheapest possible starting option.", correct: false, rationale: "Opposite — highest tier." },
          { text: "It's simply Foundation with a higher price for more profit.", correct: false, rationale: "Real structural additions, not just a markup." }
        ]
      },
      {
        question: "Why does it matter, long-term, that a rep steers a prospect toward the right tier instead of whatever they first ask for?",
        options: [
          { text: "It doesn't matter, any signed client is a good outcome regardless of fit.", correct: false, rationale: "A client who churns early isn't a good outcome — costs trust, referrals, compounding growth." },
          { text: "A mis-fit tier risks the client not seeing results, which risks early churn — which hurts both the client's outcome and the company's growth.", correct: true, rationale: "A mis-fit tier risks no results, risking churn — hurting the client and the compounding growth the retention strategy depends on." },
          { text: "It only matters for commission purposes.", correct: false, rationale: "Bigger than commission — about whether the client gets the outcome they came for." },
          { text: "Tier fit only matters after the first month, not during the sales process.", correct: false, rationale: "Fit is decided at point of sale — exactly where this reasoning needs to be applied." }
        ]
      }
    ]
  },

  module5: {
    title: "Reading an Audit",
    lesson: [
      { heading: "5.1 — What an audit is, and why it's free", body: "A snapshot of a business's entire online presence — website status, GBP completeness, local SEO rankings, citation consistency, reputation, competitor comparison — color-coded red/yellow/green, scored out of 10. Completed before the in-person meeting, free, no obligation. It's real, tangible proof of value that earns the in-person meeting." },
      { heading: "5.2 — Reading the scorecard", body: "Fastest way to size up a business before mentioning a tier. Red website status + no live site = Foundation conversation. Live decent site + weak citations/stale reviews = closer to Visibility." },
      { heading: "5.3 — Walking the Maximum Demo audit, section by section", body: "Website: completely suspended — every directory, business card, social link pointed to a dead page. Textbook Foundation case. GBP: claimed/verified but only 4 reviews, most recent 4-7 years old, no posts, no owner responses, dead link on profile. Strong foundation, badly neglected. Local SEO/Citations: not ranking for any keyword; 10+ directories all pointed to the same dead URL. Reputation: HomeAdvisor showed 5.0 stars, genuinely positive language — proves the work is excellent. Key line: \"the gap isn't quality of work, it's digital visibility.\" Competitor Snapshot: competitors ranking above them had active websites/GBP posts/review recency, not better work." },
      { heading: "5.4 — Connecting findings to tier recommendation, out loud", body: "Order matters: finding → fix → tier. Never lead with the tier. Example: \"Your website's been down, so nothing's getting indexed by Google — that's why none of your target keywords are ranking. Foundation gets you a live site again, plus the GBP cleanup and citation fixes so every dead link across Yelp, BBB, and the rest gets replaced with your new site. That's why Foundation's the right starting point here, not Visibility — there's no live site yet for Visibility to actually optimize.\"" },
      { heading: "5.5 — What reps actually do with audit findings before the in-person meeting", body: "Not expected to walk a full audit live over the phone (that's the in-person meeting's job). Two real situations: (1) prospect replies to audit email with a specific question — answer plainly, steer back to booking the meeting; (2) on the original cold call, may reference a general finding type without the full audit yet." },
      { heading: "5.6 — The \"quality vs. visibility\" reframe", body: "\"This isn't a reflection of your work — your reviews prove the work is great. It's a visibility problem. And visibility is completely fixable.\" Defuses defensiveness because it validates the prospect's work while identifying a fixable gap." }
    ],
    quiz: [
      {
        question: "In the Maximum Demo audit, what was the single most critical website finding?",
        options: [
          { text: "The website's design looked outdated.", correct: false, rationale: "A secondary note, far less severe than fully offline." },
          { text: "The website was completely suspended, so every directory and social link pointed to a dead page.", correct: true, rationale: "Top critical finding — fully suspended means every inbound click hits an error page. Most severe kind of website finding possible." },
          { text: "The website loaded too slowly.", correct: false, rationale: "Not the issue — the site wasn't loading at all, account was suspended." },
          { text: "The website had too few pages.", correct: false, rationale: "Not a finding in this audit — the core problem was no live site at all." }
        ]
      },
      {
        question: "Based on the findings, why was Foundation correct for Maximum Demo, not Visibility?",
        options: [
          { text: "Foundation is always the default recommendation regardless of findings.", correct: false, rationale: "Not a default — correct specifically because of the finding pattern." },
          { text: "Visibility only optimizes an existing website, and Maximum Demo had no live website to optimize.", correct: true, rationale: "Ties Module 4's tier logic to a real case — Visibility structurally can't help a business with no live site." },
          { text: "Foundation is cheaper, so it made sense to start low.", correct: false, rationale: "Foundation is the middle tier, not cheapest. Based on fit, not price." },
          { text: "Dominate would have made more sense instead.", correct: false, rationale: "Dominate assumes an existing presence — not yet appropriate here." }
        ]
      },
      {
        question: "The audit showed a 5.0-star HomeAdvisor rating despite ranking nowhere on Google. Correct takeaway for a similar prospect?",
        options: [
          { text: "Their work must not actually be that good if they're not ranking.", correct: false, rationale: "Inaccurate and insulting — the reviews are real evidence the work is good." },
          { text: "The gap isn't quality of work — it's a visibility problem, and visibility is fixable.", correct: true, rationale: "The core reframe — real evidence of quality paired with zero visibility proves they're separate problems." },
          { text: "Reviews don't matter if a business isn't ranking on Google.", correct: false, rationale: "Reviews matter as trust signals, they just don't substitute for search visibility." },
          { text: "HomeAdvisor reviews don't count as real proof of quality.", correct: false, rationale: "HomeAdvisor reviews are legitimate proof of satisfaction." }
        ]
      },
      {
        question: "A prospect emails back after receiving their audit and asks, \"What does 'GBP neglect' mean?\" What should a rep do?",
        options: [
          { text: "Tell them to wait until the in-person meeting for any explanation.", correct: false, rationale: "Refusing to answer reads as evasive." },
          { text: "Answer plainly using the audit's actual language, then steer back toward booking the in-person meeting.", correct: true, rationale: "Reps should be equipped to answer specific audit questions plainly and confidently, building trust while still steering toward the in-person meeting." },
          { text: "Forward the question to Joseph without responding at all.", correct: false, rationale: "Escalating every question undercuts the credibility this training is built to establish." },
          { text: "Give a vague, general answer to avoid giving away too much before the meeting.", correct: false, rationale: "Vague isn't professional — a clear, specific answer builds more trust." }
        ]
      },
      {
        question: "Correct order for connecting an audit finding to a tier recommendation?",
        options: [
          { text: "State the tier first, then justify it with any nearby finding.", correct: false, rationale: "Leading with the tier sounds like a sales push rather than a diagnosis." },
          { text: "State the finding, then the fix, then the tier — in that order.", correct: true, rationale: "Finding → fix → tier makes the recommendation sound like a diagnosis based on evidence, not a sales push." },
          { text: "Skip the finding entirely and just discuss pricing.", correct: false, rationale: "Removes the evidence behind the recommendation." },
          { text: "Order doesn't matter as long as all three points are mentioned.", correct: false, rationale: "Order matters psychologically — finding-first establishes credibility before any ask." }
        ]
      }
    ]
  },

  module6: {
    title: "The Sales Process",
    lesson: [
      { heading: "6.1 — The framework: Straight Line Persuasion", body: "Every sales conversation moves in a straight line toward one outcome; the rep's job is to keep steering it back on line. Core rule: tell, don't ask. Statements keep the rep steering; questions hand the prospect a choice to end the call." },
      { heading: "6.2 — The Three Tens", body: "1. The product — do they believe it solves their problem? 2. You — do they trust the rep? 3. Boring project — do they believe the company is legitimate? All script pieces move all three at once." },
      { heading: "6.3 — Before the script starts: human connection (untimed, verbatim)", body: "\"Hey, is this [Lead Name]?\" — wait for yes. \"Perfect, you're just the person I was looking for! How's your day going?\" — let them answer, actually listen. \"Oh good, same here. I'm going to cut to the chase—\" Why no company name yet: an unrecognized name is the fastest hang-up trigger. Why this still counts as steering: the rep still ends it — cutting to the chase is announced, not requested." },
      { heading: "6.4 — The 60-second pitch (verbatim)", body: "Step 1 — Hook: \"I'd like to properly introduce myself — this is [Your Name], I'm with Boring Project, we help local service businesses in San Antonio get found online, and stay found. This will only take sixty seconds. I found something on Google you need to know about.\" Step 2 — Intelligence: \"I searched '[service] San Antonio' this morning and you didn't show up on the first page. Your competitors did.\" Step 3 — Presentation: \"Every day, someone in this city searches for exactly what you do. Right now, that call is going to someone else. Not because they're better. Just because they show up first. Think of it like your storefront sign is missing. People are walking by every day, they just can't find you.\" Step 4 — Pivot: \"We don't just build your site, we manage it every month so it keeps growing instead of going stale. We charge a fraction of what a typical agency charges, and we never lock you into a contract.\" Step 6 — Close: \"I actually already have an email for you on file, [states the email], is that the one that reaches you best? So I can at the least send you a free audit that reviews your business's online visibility as a whole.\"" },
      { heading: "6.5 — Step 5: The Loop (reactive, pattern not script)", body: "Deflect → Loop back → Resell the Three Tens. Example — \"I already have a website\": \"That's great, when's the last time it was updated? Do you know where it ranks on Google? A site that exists but doesn't rank is like a phone that's always on silent. It's there, but nobody's getting through.\"" },
      { heading: "6.6 — After they answer", body: "\"Perfect. That audit will be in your inbox within twenty-four hours. Once you've had a chance to look it over, I'd love to sit down with you in person and walk through exactly what we found and how we'd fix it, that's really where this gets real. I'll follow up once it's sent to find a time that works.\" The call's job is to earn a real conversation, not close on its own." },
      { heading: "6.7 — The two follow-up emails", body: "Debrief (immediately after call): \"Hey [Name], Thanks for taking a minute to talk today. I'll have that free audit of [Business Name]'s online visibility over to you within 24 hours. Talk soon, [Rep Name], Boring Project\" Audit (within 24 hours, reply in same thread): \"Hey [Name], As said, here's the free audit reviewing [Business Name]'s online visibility as a whole. I hope this helps. If you want to know more, I'd be happy to schedule a time that works best for you to sit down in person for a deeper dive into the audit, what we can do for you, and how it'd bring you real value. Talk soon, [Rep Name], Boring Project\"" },
      { heading: "6.8 — Golden rules (compressed)", body: "Tell don't ask. 60 seconds, no pauses, no permission questions until the ask itself. Never quote exact price on the first call. We build it AND manage it — say both. Get a next step, not a yes. Leave real value even on a no. Follow up within 24 hours. Know the business before calling. Never trash the competition. \"I'm with Boring Project,\" never \"I run.\" Human connection first. Confirm the email, don't ask permission to send it. Always plant the in-person meeting." }
    ],
    quiz: [
      {
        question: "Why does the script wait to state the company name until after the human-connection opener?",
        options: [
          { text: "It's more polite to build rapport first.", correct: false, rationale: "Undersells the real reasoning — it's a specific hang-up-avoidance tactic." },
          { text: "A name the prospect doesn't recognize is the fastest trigger for a hang-up, so it waits until the door is already open.", correct: true, rationale: "Deliberate structural choice — an unfamiliar name in the first two seconds triggers instant hang-ups." },
          { text: "Company name is only needed if the prospect asks.", correct: false, rationale: "Always stated in Step 1 — not conditional." },
          { text: "There's no reason, it's just personal preference.", correct: false, rationale: "A deliberate, reasoned choice, not arbitrary." }
        ]
      },
      {
        question: "Why does Step 6 say \"is that the one that reaches you best?\" instead of \"can I send you an audit?\"",
        options: [
          { text: "Both phrasings are functionally identical.", correct: false, rationale: "Not equivalent — meaningfully different psychological structure." },
          { text: "The audit is happening regardless — this confirms a fact (which email) rather than asking permission for something that could be declined.", correct: true, rationale: "Core Straight Line technique — a permission question gives an easy off-ramp; confirming email treats the audit as already decided." },
          { text: "It's a more polite way of asking the same permission question.", correct: false, rationale: "Removes the permission structure entirely, not just softer wording." },
          { text: "The exact wording doesn't matter, only tone does.", correct: false, rationale: "Wording is the entire mechanism here, hence trained verbatim." }
        ]
      },
      {
        question: "Correct pattern for handling an objection during the Loop (Step 5)?",
        options: [
          { text: "Argue directly against the objection until the prospect concedes.", correct: false, rationale: "Direct argument tends to trigger defensiveness." },
          { text: "Deflect, loop back to the core problem, resell the Three Tens.", correct: true, rationale: "The exact trained pattern — avoids confrontation while steering back on line." },
          { text: "Immediately offer a discount to overcome the objection.", correct: false, rationale: "Discounting isn't part of the process — price isn't even quoted on a first call." },
          { text: "End the call politely once an objection is raised.", correct: false, rationale: "An objection is exactly what the Loop exists to handle, not a reason to end the call." }
        ]
      },
      {
        question: "Why does the debrief email get sent immediately, separate from the audit email 24 hours later?",
        options: [
          { text: "It's required by email software limitations.", correct: false, rationale: "Not a technical limitation — an intentional two-touch sequence." },
          { text: "The immediate debrief is its own certainty touchpoint — prompt follow-through builds trust, and it sets a visible clock the prospect is now watching.", correct: true, rationale: "Does real work on its own — proves reliability fast, creates a specific visible deadline." },
          { text: "There's no real reason, it's just tradition.", correct: false, rationale: "Deliberate, reasoned part of the sequence." },
          { text: "Combining them would take too much writing time.", correct: false, rationale: "Both emails are short — separation is about psychological timing, not writing effort." }
        ]
      },
      {
        question: "What is the actual goal of the entire cold call and follow-up sequence?",
        options: [
          { text: "To close the sale entirely over the phone.", correct: false, rationale: "The call is explicitly not designed to close on its own." },
          { text: "To land the in-person meeting where Joseph closes the deal.", correct: true, rationale: "Stated explicitly and repeatedly — the entire sequence exists to earn a seat at the table for the in-person meeting." },
          { text: "To get the prospect to agree to a specific tier immediately.", correct: false, rationale: "Tier fit isn't discussed by exact price on the first call — the audit is the diagnostic tool." },
          { text: "To deliver the audit and consider the job done.", correct: false, rationale: "The audit is a milestone, not the finish line." }
        ]
      }
    ]
  },

  module7: {
    title: "Objection Handling — Beyond the Loop",
    lesson: [
      { heading: "7.1 — Quick review", body: "Every objection gets handled the same three-step way regardless of phrasing: Deflect, Loop back, Resell the Three Tens." },
      { heading: "7.2 — \"Just send me some information\" / \"Email me instead\"", body: "Often a polite way to end the call without saying no. Response: \"Absolutely, that's exactly what I'm doing — I'm sending over a free audit either way. But real quick, while I've got you — I did search for [service] San Antonio this morning and didn't see you on the first page. That's really the whole reason I called. Once you get the audit, I'd love ten minutes in person to actually walk through what's fixable, that's where this actually gets useful instead of just words on a page.\"" },
      { heading: "7.3 — \"How do I know you're not a scam?\"", body: "Response: \"Totally fair to ask, honestly. I'm a real person, born and raised right here in San Antonio — this isn't a call center somewhere else. The audit I'm sending is free, no card, no obligation, you can look it over and decide for yourself. If it's not useful, no hard feelings, you keep it either way.\"" },
      { heading: "7.4 — \"We already tried an agency before and got burned\"", body: "Response: \"Yeah, I hear that a lot, honestly — a lot of agencies take your money, build something, and disappear. That's actually the exact reason we don't lock anyone into a contract. We manage it every month, ongoing, so if it's not working, you're not stuck. I'd still like to send the free audit over, at the very least it'll show you exactly where things stand right now, no strings.\"" },
      { heading: "7.5 — \"I don't have time for this right now\"", body: "Response: \"No worries at all, I know it's the middle of the day. I'll keep this quick — I already have your email on file, I'm going to send that free audit either way so it's there whenever you do have a minute. Sound good?\"" },
      { heading: "7.6 — \"I'm not the right person, talk to [owner/partner]\"", body: "Response: \"No problem — is [name] available now, or is there a better number or email to reach them directly? I want to make sure the audit actually lands with the right person instead of getting lost.\"" },
      { heading: "7.7 — Gatekeeper screening", body: "Approved line: \"Sure — I'm reaching out because I found something on Google about [Business Name]'s online visibility that [Owner Name] would probably want to know about. Is he available for a quick minute?\"" },
      { heading: "7.8 — When to let a \"no\" be a no", body: "After a genuine attempt at the Loop, if firmly declined even the free audit — polite, no-pressure exit, not repeated pushing. Approved exit line: \"Totally understand, no pressure at all. If anything changes, we're easy to find — have a good one.\"" }
    ],
    quiz: [
      {
        question: "A prospect says \"just send me some information\" almost immediately. Correct read?",
        options: [
          { text: "It's always a genuine yes, treat it as a closed deal.", correct: false, rationale: "Skips the actual purpose of the rest of the call." },
          { text: "It's often a polite way to end the call, so the rep should agree while still looping back to the real problem and planting the in-person ask.", correct: true, rationale: "The request is easy to honor since the audit is already promised, but looping back keeps the sequence on track." },
          { text: "It means the prospect is not a real lead and should be dropped.", correct: false, rationale: "A common, mild deflection, not a rejection." },
          { text: "It means the rep should immediately quote a price.", correct: false, rationale: "Pricing is never quoted on a first call regardless." }
        ]
      },
      {
        question: "How should a rep respond to \"how do I know this isn't a scam?\"",
        options: [
          { text: "Get defensive and insist the company is legitimate.", correct: false, rationale: "Defensiveness increases suspicion." },
          { text: "Acknowledge it's a fair question, lean on real local specificity, and remind them the audit is free with zero obligation.", correct: true, rationale: "Validates the question, uses genuine local credibility, removes risk by reinforcing free/no-obligation." },
          { text: "Hang up, since this prospect is clearly not interested.", correct: false, rationale: "A normal, common question, not disinterest." },
          { text: "Avoid answering and change the subject quickly.", correct: false, rationale: "Dodging reads as more suspicious." }
        ]
      },
      {
        question: "A prospect says they were burned by a previous agency. Strongest way to use this objection?",
        options: [
          { text: "Criticize the previous agency by name if the prospect mentions it.", correct: false, rationale: "Never trash the competition, even one the prospect names first." },
          { text: "Validate the experience as common, then point directly to the no-contract, ongoing-management model as the specific answer to that exact pain point.", correct: true, rationale: "This objection reveals exactly what the prospect fears — point to a specific, real structural difference." },
          { text: "Assure them boring project. is completely different with no further explanation.", correct: false, rationale: "A vague claim doesn't address the fear — name the real structural reason." },
          { text: "Avoid discussing it and pivot to a different topic entirely.", correct: false, rationale: "Valuable information, not something to avoid." }
        ]
      },
      {
        question: "When a gatekeeper asks \"what is this regarding?\", correct approach?",
        options: [
          { text: "Deliver the full 60-second pitch to the gatekeeper.", correct: false, rationale: "Wastes the pitch on someone who can't act on it." },
          { text: "Give a brief, specific, honest reason tied to the business itself, without overselling to someone who can't say yes anyway.", correct: true, rationale: "Specific enough to earn a transfer, short since the gatekeeper isn't the decision-maker." },
          { text: "Refuse to explain anything until transferred.", correct: false, rationale: "More likely to get blocked, not transferred." },
          { text: "Claim to be a personal friend of the owner to get transferred faster.", correct: false, rationale: "Dishonest, risks real damage to trust and reputation." }
        ]
      },
      {
        question: "When should a rep stop pushing and let a \"no\" be a no?",
        options: [
          { text: "Never — always keep pushing regardless of how firm the decline is.", correct: false, rationale: "Risks real reputational damage where word travels." },
          { text: "After a genuine attempt at the Loop, if the prospect firmly declines even the free audit, exit politely without repeated pushing.", correct: true, rationale: "Matches golden rule #6 — continuing to push past a clear decline damages trust more than it's worth in a local market." },
          { text: "Immediately at the first sign of any hesitation.", correct: false, rationale: "Initial hesitation is exactly what the Loop is designed to work through." },
          { text: "Only if the prospect explicitly uses the word \"no\" three separate times.", correct: false, rationale: "No literal word-count threshold — judgment based on a genuine Loop attempt and a clearly firm decline." }
        ]
      }
    ]
  },

  module8: {
    title: "Retention & Why Clients Stay",
    lesson: [
      { heading: "8.1 — The monthly report is the retention weapon", body: "Visible, tangible progress the client couldn't produce alone. The moment reporting stops, clients start wondering if they need the service." },
      { heading: "8.2 — SEO compounds — stopping is costly", body: "Months of pages/citations/reviews/content build on each other. Canceling early loses accumulated momentum while competitors keep moving." },
      { heading: "8.3 — You hold the keys", body: "Search Console, Analytics, GBP manager access, running history of what's worked — takes a new agency 3-6 months to rebuild. A real, honest switching cost." },
      { heading: "8.4 — The phone keeps ringing — the product retains itself", body: "When calls actually increase, clients upgrade rather than cancel. Real proof point for a skeptical prospect." },
      { heading: "8.5 — \"No contract\" — what that actually means", body: "boring project. doesn't lock clients into long-term contracts. What clients sign is a simple service agreement, not a binding contract. Mutual respect between parties: confirms unsettled balance gets paid, and either side gives 30 days' notice before ending the relationship, allowing time to properly package everything up and transfer to the client. Why this framing matters: \"No contract\" is accurate shorthand on the sales floor — but if directly asked \"so there's nothing in writing?\", the rep should say the real thing: yes, there's a simple service agreement, it just doesn't trap you. If asked \"what if we want to cancel later, do we keep the site?\": \"Yes — per our service agreement, outstanding balances get settled, 30 days' notice lets us package everything for transfer, and full ownership goes to you, hosting included.\"" },
      { heading: "8.6 — Can clients just do the updates themselves?", body: "Technically yes, practically no — time, expertise, and risk of breaking something. The real thing being sold is the time the client doesn't have and the expertise to do it right." },
      { heading: "8.7 — The real product is the strategy, not the website", body: "Anyone can build a website. What retains a client is ongoing intelligence — watching rankings weekly, noticing competitor moves, adding content, keeping GBP active." },
      { heading: "8.8 — The Year 1 retention arc", body: "Month 1-2: Trust window, rankings haven't moved yet, over-communicate. Month 3-4: First real movement, flag every win. Month 5-6: Upgrade conversation. Month 7-12: Lock-in — months of history make canceling mean starting over." }
    ],
    quiz: [
      {
        question: "Why is the monthly report described as the \"retention weapon\"?",
        options: [
          { text: "It's a legal requirement of the service agreement.", correct: false, rationale: "Not a compliance formality — an active trust-building tool." },
          { text: "It provides visible, tangible proof of progress the client couldn't produce alone, which is what keeps them from wondering if they still need the service.", correct: true, rationale: "Converts abstract trust into concrete evidence every month — the moment it stops, doubt creeps in." },
          { text: "It's mainly used to justify raising prices later.", correct: false, rationale: "Not its purpose — about proving ongoing value." },
          { text: "It has no real effect on whether a client stays.", correct: false, rationale: "Opposite of what the module teaches." }
        ]
      },
      {
        question: "Why does SEO \"compounding\" matter when a prospect asks about canceling early?",
        options: [
          { text: "Canceling early has zero downside since SEO doesn't build on itself.", correct: false, rationale: "Factually backwards." },
          { text: "Months of pages, citations, reviews, and content build on each other — canceling early loses that accumulated momentum while competitors keep moving.", correct: true, rationale: "Ties back to Module 4's downgrade objection — competitors who stay active continue moving while a canceled client's progress stalls." },
          { text: "SEO compounding only matters for Dominate-tier clients.", correct: false, rationale: "Applies across all tiers with ongoing work." },
          { text: "Compounding is a marketing term with no real practical effect.", correct: false, rationale: "Has a real, concrete effect throughout retention materials." }
        ]
      },
      {
        question: "A client asks, \"If we cancel later, do we keep the website?\" Correct, honest answer?",
        options: [
          { text: "\"No, the website belongs to us since we built it.\"", correct: false, rationale: "Factually wrong per company policy." },
          { text: "\"Yes — per our service agreement, outstanding balances get settled, 30 days' notice lets us package everything for transfer, and full ownership goes to you, hosting included.\"", correct: true, rationale: "The accurate policy under the service agreement — stating it plainly builds trust." },
          { text: "\"That depends on which tier you're on.\"", correct: false, rationale: "Not accurate — the policy is consistent regardless of tier once balances are settled." },
          { text: "\"We'd prefer not to discuss that until you decide to cancel.\"", correct: false, rationale: "Dodging creates the exact suspicion answering honestly prevents." }
        ]
      },
      {
        question: "Why is boring project's simple service agreement (no long-term contract) framed as a strength?",
        options: [
          { text: "It isn't actually a strength, it just sounds better in sales conversations.", correct: false, rationale: "Has a real, described mechanical effect, not just framing." },
          { text: "It removes the biggest objection in the sale, and it shifts retention onto real results instead of lock-in — while the service agreement still fairly protects both sides.", correct: true, rationale: "No long-term lock-in removes friction and signals confidence, but the service agreement still fairly covers unsettled balances and a 30-day transition." },
          { text: "It means clients rarely stay past the first month.", correct: false, rationale: "Opposite of the described effect — clients stay because results keep them." },
          { text: "It only applies to the Visibility tier.", correct: false, rationale: "Applies across all three tiers." }
        ]
      },
      {
        question: "According to the Year 1 retention arc, what should a rep say if asked \"when will I actually see results\"?",
        options: [
          { text: "\"Immediately, within the first week.\"", correct: false, rationale: "Inaccurate, sets up disappointment." },
          { text: "A grounded, honest answer based on the real timeline — little movement in months 1-2, first real traction around months 3-4, continued growth through month 12.", correct: true, rationale: "Setting accurate expectations upfront prevents a client feeling misled and churning early." },
          { text: "\"There's no way to predict that at all.\"", correct: false, rationale: "There is a real, describable timeline." },
          { text: "\"Results are guaranteed within 30 days or your money back.\"", correct: false, rationale: "No such guarantee exists in company materials — a false promise." }
        ]
      }
    ]
  }
};
