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
// 4. If valid, looks up the user's role in USER_REGISTRY (server-side —
//    can't be tampered with from the browser)
// 5. Mints a Firebase custom token with { role, email } as claims
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
  // "rep1@example.com": { role: "sales_rep", name: "Rep One" },
  // "rep2@example.com": { role: "sales_rep", name: "Rep Two" },
  // "rep3@example.com": { role: "sales_rep", name: "Rep Three" },
};

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

      // --- Look up role, server-side only ---
      const registryEntry = USER_REGISTRY[email];
      if (!registryEntry) {
        res.status(403).json({
          error: "no_role_assigned",
          message: "This account isn't registered as a rep or admin yet. Contact Joseph.",
        });
        return;
      }

      // --- Mint the Firebase custom token ---
      try {
        const customToken = await admin.auth().createCustomToken(email, {
          role: registryEntry.role,
          email,
        });

        res.status(200).json({
          token: customToken,
          role: registryEntry.role,
          name: registryEntry.name,
          email,
        });
      } catch (err) {
        console.error("mintFirebaseToken error:", err);
        res.status(500).json({error: "Failed to mint token."});
      }
    },
);

