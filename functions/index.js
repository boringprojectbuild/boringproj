// functions/index.js
//
// mintFirebaseToken — Firebase Cloud Function
//
// Replaces the old Netlify Function of the same purpose. Bridges Netlify
// Identity (used for login on boringproj.com) into Firebase Auth, so
// Firestore Security Rules can finally enforce real permissions instead
// of just hiding buttons in the UI.
//
// How verification works (no shared secret needed):
// Netlify Identity runs on GoTrue, which exposes a standard endpoint at
// https://boringproj.com/.netlify/identity/user that verifies a token
// and returns the associated user if it's valid. We call that directly
// from here — if Netlify's own service confirms the token is real, we
// trust it and mint a matching Firebase custom token.
//
// Flow:
// 1. Rep logs into the portal via Netlify Identity (unchanged)
// 2. Dashboard sends its Netlify access token to this function
// 3. This function verifies that token by asking Netlify's own
//    /.netlify/identity/user endpoint
// 4. If valid, looks up the user's role in USER_REGISTRY and/or client
//    identity in CLIENT_REGISTRY (server-side — can't be tampered with
//    from the browser)
// 5. Mints a Firebase custom token with whichever of { role, clientKey,
//    email } apply — a rep/admin gets { role, email }, a client gets
//    { clientKey, email }, and an account that's both (e.g. Joseph's own
//    admin login, which doubles as the "boringproject" demo client) gets
//    all three. The JSON response (not just the token's claims) also
//    carries a client's full record — name, contact, hasWebsiteService,
//    hasCRM — so the dashboard doesn't need its own copy of any of that.
// 6. Dashboard signs into Firebase with that token, unlocking real
//    Firestore Security Rules enforcement

const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

// --- Your site's domain — used to verify tokens against your own
// Netlify Identity instance ---
const SITE_URL = "https://boringproj.com";

// --- User registry ---
// Server-side only — a rep can't grant themselves admin by editing
// browser code. Add new reps here as they're onboarded.
const USER_REGISTRY = {
  "boringprj210@gmail.com": {role: "admin", name: "Joseph Gutierrez"},
  "gabeguti2020@gmail.com": {role: "sales_rep", name: "Gabriel Gutierrez"},
  "josephmata14@gmail.com": {role: "sales_rep", name: "Joseph Mata"},
  // "rep1@example.com": { role: "sales_rep", name: "Rep One" },
  // "rep2@example.com": { role: "sales_rep", name: "Rep Two" },
  // "rep3@example.com": { role: "sales_rep", name: "Rep Three" },
};

// --- Client registry ---
// The single source of truth for client identity AND entitlements
// (hasWebsiteService/hasCRM). portal-dashboard.html's local CLIENTS
// object is a fallback only, for the brief window before this bridge
// resolves (or if it fails outright) — it should never be the thing
// that decides what a client is entitled to, since anyone could edit it
// in browser dev tools. admin.html has its own separate, unrelated
// CLIENTS object (key/name/contact only, for the messaging UI) that
// doesn't reference entitlements and isn't affected by this one.
const CLIENT_REGISTRY = {
  "luminaservices220@outlook.com": {
    clientKey: "lumina",
    name: "Lumina Cleaning Service",
    contact: "Aislinn Venegas",
    hasWebsiteService: true,
    hasCRM: false,
    // TODO: placeholder only — get Lumina's real business address before
    // this account could ever send real automated email. A CAN-SPAM
    // footer with a fake address is worse than no footer at all.
    address: "Address on file",
    // TODO: placeholder only — get Lumina's real Google review link.
    // Empty means generated review drafts keep the [GOOGLE_REVIEW_LINK]
    // placeholder for a human to fill in.
    googleReviewLink: "",
  },
  "boringprj210@gmail.com": {
    clientKey: "boringproject",
    name: "boring project.",
    contact: "Joseph Gutierrez",
    hasWebsiteService: true,
    hasCRM: true,
    address: "7746 Beechnut Oak, San Antonio, TX 78223",
    googleReviewLink: "https://g.page/r/Cd6a2R5zYMGmEAI/review",
  },
};

// Reverse lookup (clientKey -> registry entry) — the scheduled function
// below only has a contact's clientKey to work with, not their login
// email, so it needs this the other way around from CLIENT_REGISTRY.
const CLIENT_BY_KEY = Object.fromEntries(
    Object.values(CLIENT_REGISTRY).map((entry) => [entry.clientKey, entry]),
);

exports.mintFirebaseToken = onRequest(
    {cors: true},
    async (req, res) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ") ?
      authHeader.slice(7) :
      null;

      if (!token) {
        res.status(401).json({error: "Missing Netlify Identity token."});
        return;
      }

      // --- Verify the token against Netlify's own Identity service ---
      let netlifyUser;
      try {
        const verifyRes = await fetch(`${SITE_URL}/.netlify/identity/user`, {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (!verifyRes.ok) {
          res.status(401).json({error: "Invalid or expired Netlify session."});
          return;
        }

        netlifyUser = await verifyRes.json();
      } catch (err) {
        console.error("Netlify Identity verification failed:", err);
        res.status(502).json({error: "Could not verify session with Netlify."});
        return;
      }

      const email = (netlifyUser.email || "").toLowerCase();
      if (!email) {
        res.status(401).json({error: "No email found on verified session."});
        return;
      }

      // --- Look up role and/or client identity, server-side only ---
      const repEntry = USER_REGISTRY[email];
      const clientEntry = CLIENT_REGISTRY[email];

      if (!repEntry && !clientEntry) {
        res.status(403).json({
          error: "no_role_assigned",
          message: "This account isn't registered as a rep, admin, or client yet. Contact Joseph.",
        });
        return;
      }

      // --- Mint the Firebase custom token — include whichever claims
      // apply. An account can be both (Joseph's admin login also serves
      // as the "boringproject" demo client), so these aren't exclusive. ---
      const claims = {email};
      if (repEntry) claims.role = repEntry.role;
      if (clientEntry) claims.clientKey = clientEntry.clientKey;

      try {
        const customToken = await admin.auth().createCustomToken(email, claims);

        res.status(200).json({
          token: customToken,
          role: repEntry ? repEntry.role : undefined,
          clientKey: clientEntry ? clientEntry.clientKey : undefined,
          name: (repEntry && repEntry.name) || (clientEntry && clientEntry.name),
          contact: clientEntry ? clientEntry.contact : undefined,
          hasWebsiteService: clientEntry ? clientEntry.hasWebsiteService : undefined,
          hasCRM: clientEntry ? clientEntry.hasCRM : undefined,
          address: clientEntry ? clientEntry.address : undefined,
          googleReviewLink: clientEntry ? clientEntry.googleReviewLink : undefined,
          email,
        });
      } catch (err) {
        console.error("mintFirebaseToken error:", err);
        res.status(500).json({error: "Failed to mint token."});
      }
    },
);

// generateReviewRequestDrafts — scheduled Cloud Function
//
// Runs hourly. For every contact that's been sitting in the 'won' stage
// for at least 24 hours with no review request yet and no opt-out, this
// stages a personalized draft (subject/body) and flips
// reviewRequestStatus to 'pending' so it shows up in that client's
// "Ready to send" list on the CRM Overview tab. It does not send
// anything — sending is a separate, explicit action a client takes from
// that list (see portal-dashboard.html).
//
// Idempotency: the only thing that makes a contact eligible is
// `!c.reviewRequestStatus` (never touched before). Once this function
// sets it to 'pending', that same contact is excluded from every future
// run — including a second run in the same hour, a retried invocation,
// or a manual re-trigger. Nothing here depends on run history/locking to
// stay safe to re-run.
//
// Query strategy: Firestore can't express "field is unset" or combine an
// inequality on wonAt with an equality on clientKey/reviewRequestStatus
// without extra composite indexes. Given the small number of contacts
// actually sitting in 'won' at any moment, it's simpler and just as
// correct to fetch everything with stage == 'won' (a single-field
// equality query — no new index needed) and filter the rest in memory.
//
// Each client's googleReviewLink lives in CLIENT_REGISTRY. If it's empty,
// the draft keeps the literal [GOOGLE_REVIEW_LINK] placeholder so a human
// knows to swap it in before sending.
const {onSchedule} = require("firebase-functions/v2/scheduler");

const WON_REVIEW_DELAY_MS = 24 * 60 * 60 * 1000;

/**
 * Builds the personalized review-request draft for one won contact.
 * @param {string} firstName Contact's first name.
 * @param {string} businessName Client's business name (from CLIENT_REGISTRY).
 * @param {string} googleReviewLink Client's review URL; empty keeps the placeholder.
 * @return {{subject: string, body: string}} The draft.
 */
function buildReviewRequestDraft(firstName, businessName, googleReviewLink) {
  const subject = `${firstName}, got 60 seconds for ${businessName}?`;
  const body = `Hi ${firstName},

Thanks again for choosing ${businessName} — we're glad we could help.

If you have a minute, a quick Google review would mean a lot to us and
helps other folks in the area find us:

${googleReviewLink || "[GOOGLE_REVIEW_LINK]"}

Thanks again,
${businessName}`;
  return {subject, body};
}

exports.generateReviewRequestDrafts = onSchedule("every 1 hours", async () => {
  const db = admin.firestore();
  const cutoffMillis = Date.now() - WON_REVIEW_DELAY_MS;

  const wonSnapshot = await db.collection("contacts")
      .where("stage", "==", "won")
      .get();

  const batch = db.batch();
  let staged = 0;

  wonSnapshot.forEach((docSnap) => {
    const c = docSnap.data();

    // Already handled (pending/dismissed/sent) — this is the idempotency
    // guard. A contact only ever passes this check once, on the first
    // run after it's eligible.
    if (c.reviewRequestStatus) return;
    if (c.emailOptOut === true) return;

    const wonAtMillis = c.wonAt && typeof c.wonAt.toMillis === "function" ?
      c.wonAt.toMillis() :
      null;
    if (!wonAtMillis || wonAtMillis > cutoffMillis) return;

    const clientMeta = CLIENT_BY_KEY[c.clientKey];
    const businessName = clientMeta ? clientMeta.name : "us";
    const reviewLink = clientMeta && typeof clientMeta.googleReviewLink === "string" ?
      clientMeta.googleReviewLink.trim() :
      "";
    const firstName = (c.name || "").trim().split(/\s+/)[0] || "there";

    batch.update(docSnap.ref, {
      reviewRequestDraft: buildReviewRequestDraft(firstName, businessName, reviewLink),
      reviewRequestStatus: "pending",
    });
    staged++;
  });

  if (staged > 0) await batch.commit();
  console.log(`generateReviewRequestDrafts: staged ${staged} draft(s).`);
});

/**
 * Minimal HTML-escape for values interpolated into the unsubscribe page.
 * CLIENT_REGISTRY entries are hardcoded server-side, not user input, so
 * this isn't defending against a real attacker-controlled string today —
 * it's here so that stays true if a business name with a `<` or `&` in
 * it is ever added, instead of relying on it never happening.
 * @param {string} str Raw string.
 * @return {string} HTML-safe string.
 */
function escapeHtml(str) {
  return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
}

// unsubscribeContact — public Cloud Function (no auth)
//
// Reached by a link inside a review-request email, clicked from an end
// customer's own inbox — there's no Firebase session at that point, so
// this can't be enforced through Firestore rules the way everything else
// in this app is. It uses the Admin SDK directly to bypass them, same as
// mintFirebaseToken does for its own lookups, just without ever minting
// a token here — this endpoint doesn't authenticate anyone, it just
// flips one field on one document.
//
// Looked up by unsubscribeToken, not the Firestore document ID, on
// purpose — the doc ID is guessable/enumerable (sequential-ish, and
// visible in portal-dashboard.html's own network requests), so it must
// not be the thing that lets someone opt another contact out. The token
// is a 16-byte random value generated once at contact creation (see
// portal-dashboard.html) specifically so it can't be guessed.
exports.unsubscribeContact = onRequest(async (req, res) => {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  let businessName = null;

  if (token) {
    try {
      const db = admin.firestore();
      const snapshot = await db.collection("contacts")
          .where("unsubscribeToken", "==", token)
          .limit(1)
          .get();

      if (!snapshot.empty) {
        const contactDoc = snapshot.docs[0];
        await contactDoc.ref.update({emailOptOut: true});
        const clientMeta = CLIENT_BY_KEY[contactDoc.data().clientKey];
        businessName = clientMeta ? clientMeta.name : null;
      }
    } catch (err) {
      // Falls through to the same confirmation page either way — logged
      // here so we can notice and investigate, but an end customer who
      // just clicked "unsubscribe" shouldn't see a stack trace over it.
      console.error("unsubscribeContact error:", err);
    }
  }

  // Same page whether the token matched, was invalid/unknown, or the
  // lookup errored out — deliberately not revealing which. There's no
  // reason a broken or guessed link needs to tell the visitor why.
  const message = businessName ?
    `You won't receive further emails from ${escapeHtml(businessName)}.` :
    "You won't receive further emails.";

  res.set("Content-Type", "text/html");
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Unsubscribed</title>
<style>
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0D0D0D;
    color: #F5F5F3;
    font-family: sans-serif;
    text-align: center;
    padding: 24px;
  }
</style>
</head>
<body>
  <div>
    <p style="font-size:18px; margin:0;">You've been unsubscribed.</p>
    <p style="font-size:15px; margin:12px 0 0;">${message}</p>
  </div>
</body>
</html>`);
});


// captureTallyLead — public Cloud Function (no Firebase auth)
//
// Webhook target for Tally forms: each submission is POSTed here as a
// FORM_RESPONSE event and becomes a new_lead contact in the CRM. Reached
// by Tally's servers, not a signed-in user, so like unsubscribeContact it
// uses the Admin SDK and can't be protected by Firestore rules. One
// webhook URL per form, with ?client=<clientKey> saying whose CRM the
// lead belongs to (must be a CLIENT_REGISTRY client with hasCRM).
//
// Verification: Tally sends Tally-Signature = base64(HMAC-SHA256(secret,
// raw body)). The HMAC is computed over req.rawBody — the exact bytes
// Tally signed — not a re-serialized req.body, since re-stringifying can
// change whitespace/key order and break the match. Compared with
// crypto.timingSafeEqual on equal-length buffers (length is checked
// first, since timingSafeEqual throws on a mismatch). A missing header is
// rejected the same as a bad one — there is deliberately no "unsigned is
// fine" path, or anyone who finds the URL could fill the CRM with junk.
//
// Idempotency: Tally retries on timeouts/non-2xx, so the same submission
// can arrive more than once. The contact's document ID is derived from
// the submission id ("tally_<id>") and written with create(), which fails
// if the doc exists — a retry then returns 200 without writing again,
// with no read-then-write race.
//
// Logging: client key, result and field LABELS only. Values are
// customers' personal information and never get logged.
const crypto = require("crypto");
const {defineSecret} = require("firebase-functions/params");

const TALLY_SIGNING_SECRET = defineSecret("TALLY_SIGNING_SECRET");

/**
 * Checks Tally's HMAC signature over the raw request body.
 * @param {Buffer} rawBody The exact bytes Tally sent.
 * @param {string} header The Tally-Signature header value.
 * @param {string} secret The shared signing secret.
 * @return {boolean} True only if the signature matches.
 */
function verifyTallySignature(rawBody, header, secret) {
  if (!rawBody || typeof header !== "string" || !header || !secret) {
    return false;
  }
  const expected = Buffer.from(
      crypto.createHmac("sha256", secret).update(rawBody).digest("base64"),
  );
  const received = Buffer.from(header);
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}

/**
 * Turns a Tally field value into display text. Handles plain strings,
 * choice/dropdown arrays (option ids resolved via field.options), and
 * option/file objects.
 * @param {Object} field One entry of data.fields.
 * @return {string} The text, or "" if unanswered.
 */
function tallyValueToText(field) {
  const options = Array.isArray(field.options) ? field.options : [];
  const one = (v) => {
    if (v === null || v === undefined) return "";
    if (typeof v === "object") {
      return String(v.text || v.label || v.name || v.url || "").trim();
    }
    const match = options.find((o) => o && o.id === v);
    return String(match && match.text ? match.text : v).trim();
  };
  const v = field.value;
  if (Array.isArray(v)) return v.map(one).filter(Boolean).join(", ");
  return one(v);
}

/**
 * Maps Tally's label-based answers onto CRM contact fields.
 * @param {Array} fields data.fields from the Tally payload.
 * @return {{contact: Object, extras: string[]}} Mapped values, plus
 *     "Label: value" lines for answered fields that didn't map.
 */
function mapTallyFields(fields) {
  const contact = {};
  const extras = [];
  const has = (label, words) => words.some((w) => label.includes(w));

  fields.forEach((f) => {
    if (!f || typeof f !== "object") return;
    const text = tallyValueToText(f);
    if (!text) return;
    const label = String(f.label || "").toLowerCase();

    let target = null;
    if (f.type === "INPUT_EMAIL" || label.includes("email")) {
      target = "email";
    } else if (f.type === "INPUT_PHONE_NUMBER" ||
        has(label, ["phone", "number"])) {
      target = "phone";
    } else if (label.includes("name")) {
      target = "name";
    } else if (has(label, ["message", "describe", "details", "service",
      "help", "project"])) {
      target = "jobDescription";
    }

    // First answer for each target wins; a second one (two "message"-ish
    // questions, say) is kept as an extra rather than overwriting it.
    if (target && contact[target] === undefined) {
      contact[target] = text;
    } else {
      extras.push(`${f.label || "Untitled"}: ${text}`);
    }
  });
  return {contact, extras};
}

exports.captureTallyLead = onRequest(
    {secrets: [TALLY_SIGNING_SECRET]},
    async (req, res) => {
      if (req.method !== "POST") {
        res.status(405).json({error: "Method not allowed."});
        return;
      }

      if (!verifyTallySignature(
          req.rawBody,
          req.get("Tally-Signature"),
          TALLY_SIGNING_SECRET.value(),
      )) {
        console.warn("captureTallyLead: rejected (bad or missing signature).");
        res.status(401).json({error: "Unauthorized."});
        return;
      }

      const clientKey = typeof req.query.client === "string" ?
        req.query.client : "";
      const clientMeta = CLIENT_BY_KEY[clientKey];
      if (!clientMeta || !clientMeta.hasCRM) {
        console.warn("captureTallyLead: rejected (unknown or non-CRM client).");
        res.status(400).json({error: "Bad request."});
        return;
      }

      const payload = req.body || {};
      const data = payload.data || {};
      const submissionId = data.submissionId || data.responseId;
      const fields = Array.isArray(data.fields) ? data.fields : [];
      if (payload.eventType !== "FORM_RESPONSE" || !submissionId) {
        console.warn(`captureTallyLead: ${clientKey} rejected (bad payload).`);
        res.status(400).json({error: "Bad request."});
        return;
      }

      const labels = fields.map((f) => f && f.label);
      const {contact, extras} = mapTallyFields(fields);
      const notes = extras.length ? [{
        text: extras.map((line) => `Form submission, ${line}`).join("\n"),
        createdAt: Date.now(),
      }] : [];

      const FieldValue = admin.firestore.FieldValue;
      try {
        await admin.firestore()
            .collection("contacts")
            .doc(`tally_${submissionId}`)
            .create({
              name: contact.name || "Website lead",
              phone: contact.phone || "",
              email: contact.email || "",
              jobDescription: contact.jobDescription || "",
              source: "web_form",
              stage: "new_lead",
              value: 0,
              clientKey,
              notes,
              emailOptOut: false,
              unsubscribeToken: crypto.randomBytes(16).toString("hex"),
              createdAt: FieldValue.serverTimestamp(),
              lastActivityAt: FieldValue.serverTimestamp(),
            });
        console.log(`captureTallyLead: ${clientKey} created; labels:`,
            JSON.stringify(labels));
      } catch (err) {
        // gRPC ALREADY_EXISTS (6): a Tally retry of a submission we
        // already stored.
        if (err && (err.code === 6 || err.code === "already-exists")) {
          console.log(`captureTallyLead: ${clientKey} duplicate; labels:`,
              JSON.stringify(labels));
          res.status(200).json({ok: true});
          return;
        }
        console.error("captureTallyLead error:", err && err.code);
        res.status(500).json({error: "Failed to save."});
        return;
      }
      res.status(200).json({ok: true});
    },
);

// addProspectLeads — public Cloud Function (bearer-secret auth)
//
// Lets an automated prospecting job (Cowork) drop vetted leads into the
// same `leads` collection the admin portal's Add Lead form writes to, in
// the exact same shape, so they show up in the shared Leads table.
// Reached by a script, not a signed-in user, so like captureTallyLead it
// uses the Admin SDK and is protected by a shared secret instead of
// Firestore rules: "Authorization: Bearer <PROSPECT_INGEST_SECRET>".
//
// Secret check: both sides are hashed with SHA-256 first, so the two
// buffers handed to crypto.timingSafeEqual are always the same length
// (it throws otherwise) and the comparison leaks nothing about length.
// Missing or wrong gets a bare 401.
//
// Safety rails: at most 5 leads per request, and at most 5 created per
// America/Chicago calendar day in total (counter doc
// leadIngestCounters/<YYYY-MM-DD>). Each lead is validated on its own, so
// one bad entry doesn't sink the batch. Creation, the cap check, the
// doc-ID duplicate check and the phone duplicate check all happen in one
// transaction per lead, so concurrent calls can't overshoot the cap or
// double-create. Duplicates and invalid leads don't use up the cap.
//
// Added By is Joseph on purpose so these count toward his lead capture
// score; source: "cowork" is how they're told apart from his own.
//
// Logging: counts per status only — never phones, emails, names, notes,
// drafts or the secret.
const PROSPECT_INGEST_SECRET = defineSecret("PROSPECT_INGEST_SECRET");

const PROSPECT_MAX_PER_REQUEST = 5;
const PROSPECT_MAX_PER_DAY = 5;

/**
 * Constant-time check of an "Authorization: Bearer <secret>" header.
 * @param {string} header The Authorization header value.
 * @param {string} secret The expected secret.
 * @return {boolean} True only on an exact match.
 */
function verifyBearerSecret(header, secret) {
  if (typeof header !== "string" || !secret) return false;
  const match = /^Bearer (.+)$/.exec(header);
  if (!match) return false;
  const sha = (s) => crypto.createHash("sha256").update(s).digest();
  return crypto.timingSafeEqual(sha(match[1]), sha(secret));
}

/**
 * Today's date in America/Chicago as YYYY-MM-DD.
 * @return {string} The date string.
 */
function chicagoDateString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Validates and normalizes one prospect lead.
 * @param {*} raw One entry of the request's leads array.
 * @return {{lead: Object}|{reason: string}} Cleaned lead or rejection.
 */
function validateProspectLead(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {reason: "not an object"};
  }
  const str = (v) => (typeof v === "string" ? v.trim() : null);

  const businessName = str(raw.businessName);
  if (!businessName) return {reason: "businessName is required"};
  if (businessName.length > 120) return {reason: "businessName too long"};
  const id = businessName.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (!id) return {reason: "businessName has no usable characters"};

  const industry = str(raw.industry);
  if (!industry) return {reason: "industry is required"};
  if (industry.length > 80) return {reason: "industry too long"};

  let phone = str(raw.phone);
  if (!phone) return {reason: "phone is required"};
  phone = phone.replace(/\D/g, "");
  if (phone.length === 11 && phone.startsWith("1")) phone = phone.slice(1);
  if (phone.length !== 10) return {reason: "phone must be 10 digits"};

  let email = "";
  if (raw.email !== undefined && raw.email !== null && raw.email !== "") {
    email = str(raw.email);
    if (email === null || email.length > 200 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {reason: "email is not valid"};
    }
  }

  const notes = str(raw.notes);
  if (!notes) return {reason: "notes is required"};
  if (notes.length > 300) return {reason: "notes over 300 characters"};

  if (!Number.isInteger(raw.score) || raw.score < 1 || raw.score > 10) {
    return {reason: "score must be a whole number 1-10"};
  }

  let sourceUrl = "";
  if (raw.sourceUrl !== undefined && raw.sourceUrl !== null &&
      raw.sourceUrl !== "") {
    sourceUrl = str(raw.sourceUrl);
    if (sourceUrl === null || sourceUrl.length > 500 ||
        !/^https?:\/\/\S+$/i.test(sourceUrl)) {
      return {reason: "sourceUrl must be an http(s) URL"};
    }
  }

  let outreachDraft = "";
  if (raw.outreachDraft !== undefined && raw.outreachDraft !== null &&
      raw.outreachDraft !== "") {
    outreachDraft = str(raw.outreachDraft);
    if (outreachDraft === null || outreachDraft.length > 1500) {
      return {reason: "outreachDraft invalid or over 1500 characters"};
    }
  }

  return {lead: {
    id, businessName, industry, phone, email, notes,
    score: raw.score, sourceUrl, outreachDraft,
  }};
}

exports.addProspectLeads = onRequest(
    {region: "us-central1", secrets: [PROSPECT_INGEST_SECRET]},
    async (req, res) => {
      if (req.method !== "POST") {
        res.status(405).json({error: "Method not allowed."});
        return;
      }

      if (!verifyBearerSecret(
          req.get("Authorization"), PROSPECT_INGEST_SECRET.value())) {
        console.warn("addProspectLeads: rejected (unauthorized).");
        res.status(401).json({error: "Unauthorized."});
        return;
      }

      const leads = req.body && req.body.leads;
      if (!Array.isArray(leads) || leads.length < 1 ||
          leads.length > PROSPECT_MAX_PER_REQUEST) {
        console.warn("addProspectLeads: rejected (bad batch size).");
        res.status(400).json({error: "Bad request."});
        return;
      }

      const db = admin.firestore();
      const today = chicagoDateString();
      const counterRef = db.collection("leadIngestCounters").doc(today);
      const results = [];

      // Sequential on purpose: later leads in a batch must see the
      // earlier ones for the duplicate and cap checks.
      for (const raw of leads) {
        const checked = validateProspectLead(raw);
        const label = raw && typeof raw.businessName === "string" ?
          raw.businessName.trim() : "";
        if (!checked.lead) {
          results.push({
            businessName: label, status: "invalid", reason: checked.reason,
          });
          continue;
        }
        const lead = checked.lead;
        const leadRef = db.collection("leads").doc(lead.id);

        try {
          const status = await db.runTransaction(async (tx) => {
            const counterSnap = await tx.get(counterRef);
            const used = counterSnap.exists ?
              (counterSnap.data().count || 0) : 0;
            const idSnap = await tx.get(leadRef);
            const phoneSnap = await tx.get(
                db.collection("leads")
                    .where("phone", "==", lead.phone).limit(1));

            if (idSnap.exists || !phoneSnap.empty) return "duplicate";
            if (used >= PROSPECT_MAX_PER_DAY) return "capped";

            tx.create(leadRef, {
              businessName: lead.businessName,
              industry: lead.industry,
              phone: lead.phone,
              email: lead.email,
              notes: lead.notes,
              stage: "Not Contacted",
              dateAdded: today,
              activeRep: "Joseph Gutierrez",
              addedByName: "Joseph Gutierrez",
              addedByEmail: "boringprj210@gmail.com",
              wonAt: null,
              score: lead.score,
              source: "cowork",
              sourceUrl: lead.sourceUrl,
              outreachDraft: lead.outreachDraft,
            });
            tx.set(counterRef, {date: today, count: used + 1});
            return "created";
          });
          results.push({businessName: lead.businessName, status});
        } catch (err) {
          // Already-exists from a racing create counts as a duplicate;
          // anything else is a generic failure.
          if (err && (err.code === 6 || err.code === "already-exists")) {
            results.push({businessName: lead.businessName,
              status: "duplicate"});
          } else {
            console.error("addProspectLeads error:", err && err.code);
            res.status(500).json({error: "Failed to save."});
            return;
          }
        }
      }

      const counts = {};
      results.forEach((r) => {
        counts[r.status] = (counts[r.status] || 0) + 1;
      });
      console.log("addProspectLeads:", JSON.stringify(counts));
      res.status(200).json({results});
    },
);
