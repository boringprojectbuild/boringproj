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

