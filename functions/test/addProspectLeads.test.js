// Plain-node unit tests: `node test/addProspectLeads.test.js`
// Stubs firebase-admin with a small in-memory Firestore; nothing real is
// touched.
const Module = require("module");
const assert = require("assert");

process.env.PROSPECT_INGEST_SECRET = "test-secret";
process.env.TALLY_SIGNING_SECRET = "dummy";

const store = new Map();
const key = (c, id) => `${c}/${id}`;
const snapOf = (id, data) => ({
  id, exists: data !== undefined, data: () => data,
});
const docRef = (c, id) => ({c, id});
const collection = (c) => ({
  doc: (id) => docRef(c, id),
  where: (f, op, v) => ({
    limit: () => ({c, f, v, isQuery: true}),
  }),
});
const readOne = (target) => {
  if (target.isQuery) {
    const hits = [...store.entries()].filter(([k, d]) =>
      k.startsWith(target.c + "/") && d[target.f] === target.v);
    return {empty: hits.length === 0};
  }
  return snapOf(target.id, store.get(key(target.c, target.id)));
};
const firestore = () => ({
  collection,
  runTransaction: async (fn) => {
    const writes = [];
    const tx = {
      get: async (t) => readOne(t),
      create: (r, d) => writes.push(["create", r, d]),
      set: (r, d) => writes.push(["set", r, d]),
    };
    const out = await fn(tx);
    writes.forEach(([op, r, d]) => {
      if (op === "create" && store.has(key(r.c, r.id))) {
        throw Object.assign(new Error("exists"), {code: 6});
      }
      store.set(key(r.c, r.id), d);
    });
    return out;
  },
});
const fakeAdmin = {initializeApp() {}, firestore};
const origLoad = Module._load;
Module._load = function(r, ...a) {
  return r === "firebase-admin" ? fakeAdmin : origLoad.call(this, r, ...a);
};
const {addProspectLeads} = require("../index.js");

const lead = (over) => Object.assign({
  businessName: "Plumb Arrow Plumbing", industry: "Plumbing",
  phone: "(210) 555-0100", notes: "No website found.", score: 8,
}, over);

const call = async (method, body, auth) => {
  const res = {
    code: null, body: null,
    status(c) {
      this.code = c; return this;
    },
    json(j) {
      this.body = j; return this;
    },
  };
  const req = {
    method, body,
    get: (h) => (h === "Authorization" ? auth : undefined),
  };
  await addProspectLeads(req, res);
  return res;
};
const AUTH = "Bearer test-secret";
const reset = () => store.clear();

const tests = {
  "wrong method -> 405": async () => {
    assert.strictEqual((await call("GET", {}, AUTH)).code, 405);
  },
  "missing secret -> 401": async () => {
    assert.strictEqual((await call("POST", {leads: [lead()]})).code, 401);
  },
  "wrong secret -> 401, nothing written": async () => {
    const r = await call("POST", {leads: [lead()]}, "Bearer nope");
    assert.strictEqual(r.code, 401);
    assert.strictEqual(store.size, 0);
  },
  "empty leads -> 400": async () => {
    assert.strictEqual((await call("POST", {leads: []}, AUTH)).code, 400);
    assert.strictEqual((await call("POST", {}, AUTH)).code, 400);
  },
  "more than 5 leads -> 400": async () => {
    const leads = Array.from({length: 6}, (_, i) =>
      lead({businessName: `B${i}`, phone: `210555010${i}`}));
    assert.strictEqual((await call("POST", {leads}, AUTH)).code, 400);
    assert.strictEqual(store.size, 0);
  },
  "invalid lead rejected alone": async () => {
    const r = await call("POST", {leads: [
      lead({score: 11}),
      lead({businessName: "Good Co", phone: "2105550111"}),
    ]}, AUTH);
    assert.strictEqual(r.code, 200);
    assert.strictEqual(r.body.results[0].status, "invalid");
    assert.ok(r.body.results[0].reason);
    assert.strictEqual(r.body.results[1].status, "created");
  },
  "duplicate doc id": async () => {
    await call("POST", {leads: [lead()]}, AUTH);
    const r = await call("POST", {leads: [
      lead({phone: "2105559999"}),
    ]}, AUTH);
    assert.strictEqual(r.body.results[0].status, "duplicate");
  },
  "duplicate phone (leading 1 stripped)": async () => {
    await call("POST", {leads: [lead()]}, AUTH);
    const r = await call("POST", {leads: [
      lead({businessName: "Other Name", phone: "+1 210-555-0100"}),
    ]}, AUTH);
    assert.strictEqual(r.body.results[0].status, "duplicate");
  },
  "daily cap of 5": async () => {
    const mk = (i) => lead({businessName: `Biz ${i}`, phone: `21055502${i}0`});
    const a = await call("POST", {leads: [0, 1, 2, 3].map(mk)}, AUTH);
    assert.ok(a.body.results.every((x) => x.status === "created"));
    const b = await call("POST", {leads: [4, 5, 6].map(mk)}, AUTH);
    assert.deepStrictEqual(b.body.results.map((x) => x.status),
        ["created", "capped", "capped"]);
  },
  "happy path writes exact shape": async () => {
    const r = await call("POST", {leads: [lead({
      email: "a@b.com", sourceUrl: "https://example.com",
      outreachDraft: "Hi there",
    })]}, AUTH);
    assert.deepStrictEqual(r.body.results,
        [{businessName: "Plumb Arrow Plumbing", status: "created"}]);
    const d = store.get("leads/plumb-arrow-plumbing");
    assert.ok(d);
    assert.strictEqual(d.phone, "2105550100");
    assert.strictEqual(d.stage, "Not Contacted");
    assert.strictEqual(d.addedByEmail, "boringprj210@gmail.com");
    assert.strictEqual(d.addedByName, "Joseph Gutierrez");
    assert.strictEqual(d.activeRep, "Joseph Gutierrez");
    assert.strictEqual(d.wonAt, null);
    assert.strictEqual(d.source, "cowork");
    assert.strictEqual(d.score, 8);
    assert.match(d.dateAdded, /^\d{4}-\d{2}-\d{2}$/);
    const others = [...store.keys()].filter((k) =>
      !k.startsWith("leads/") && !k.startsWith("leadIngestCounters/"));
    assert.deepStrictEqual(others, []);
  },
};

(async () => {
  const log = console.log;
  let failed = 0;
  for (const [name, fn] of Object.entries(tests)) {
    reset();
    console.log = () => {};
    console.warn = () => {};
    try {
      await fn();
      log("PASS", name);
    } catch (e) {
      failed++;
      log("FAIL", name, e.message);
    }
  }
  process.exit(failed ? 1 : 0);
})();
