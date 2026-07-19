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
  }
  // module2-8 to be added in a later step — leave the object open for that
};
