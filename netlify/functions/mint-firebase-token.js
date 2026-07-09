// netlify/functions/mint-firebase-token.js
//
// Bridges Netlify Identity (used for login) to Firebase Auth (used for
// Firestore Security Rules enforcement). Without this, Firestore has no
// way to know who's making a request — it only ever sees the raw Firebase
// client SDK, never the Netlify Identity session.
//
// Flow:
// 1. Rep logs into the portal via Netlify Identity (unchanged).
// 2. Dashboard calls this function, sending along the Netlify Identity JWT
//    (handled automatically — Netlify Functions receive the authenticated
//    user via context.clientContext.user when the caller is logged in).
// 3. This function looks up that user's role from the registry below,
//    then mints a Firebase custom token with { role, email } as custom
//    claims baked in.
// 4. The dashboard signs into Firebase using that token
//    (signInWithCustomToken), which makes request.auth.token.role and
//    request.auth.token.email available inside Firestore Security Rules.
//
// SETUP REQUIRED (see spec doc for full steps):
// - Generate a Firebase service account key: Firebase Console → Project
//   Settings → Service Accounts → Generate new private key
// - Store its contents as a Netlify environment variable named
//   FIREBASE_SERVICE_ACCOUNT_KEY (paste the whole JSON as a string)
// - Run `npm install firebase-admin` in the project so this import resolves

import admin from "firebase-admin";

// --- User registry ---
// This lives server-side (not in the frontend JS) specifically so a rep
// can't grant themselves admin by editing browser code. Add new reps here
// as they're onboarded. Keep this in sync with the CLIENTS-style registry
// used for client accounts, but treat this one as the source of truth for
// role assignment.
const USER_REGISTRY = {
  "boringprj210@gmail.com": { role: "admin", name: "Joseph Gutierrez" },
  // "rep1@example.com": { role: "sales_rep", name: "Rep One" },
  // "rep2@example.com": { role: "sales_rep", name: "Rep Two" },
  // "rep3@example.com": { role: "sales_rep", name: "Rep Three" },
};

// --- Initialize firebase-admin once per cold start ---
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async (req, context) => {
  const user = context.clientContext && context.clientContext.user;

  if (!user || !user.email) {
    return new Response(
      JSON.stringify({ error: "Not authenticated with Netlify Identity." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const email = user.email.toLowerCase();
  const registryEntry = USER_REGISTRY[email];

  if (!registryEntry) {
    return new Response(
      JSON.stringify({
        error: "no_role_assigned",
        message: "This account isn't registered as a rep or admin yet. Contact Joseph.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Use the email as the Firebase uid — stable, unique, easy to reason about.
    const customToken = await admin.auth().createCustomToken(email, {
      role: registryEntry.role,
      email,
    });

    return new Response(
      JSON.stringify({
        token: customToken,
        role: registryEntry.role,
        name: registryEntry.name,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("mint-firebase-token error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to mint token." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
