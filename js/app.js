"use strict";

var KEY = "mydocs.demo.v2";
var FROM = "MyDocs <hello@mydocs.ca>";
var DAY = 86400000;
var OPT_IDS = ["aoi", "t2", "cnoa", "cbank", "ptax", "mstmt"];

var ui = {
  sheet: null,
  toast: "",
  toastTimer: 0,
  error: "",
  helpLang: "en",
  signEmail: "broker@example.com",
  afterAuth: "#broker",
  customReturn: "library",
  lastKey: "",
  keepSheet: false
};
var draft = null;
var customDraft = null;
var state = null;

var EN = {
  hello: function (n) { return "Hi " + n; },
  intro: "Your broker needs the documents below. Add each one in its own place.",
  needed: "Needed",
  received: "Received",
  accepted: "Accepted",
  rejected: "Needs a fix",
  upload: "Upload",
  takePhoto: "Take photo",
  chooseFile: "Choose a file",
  addFile: "Add another file",
  still: function (n) { return n === 1 ? "1 item still needed" : n + " items still needed"; },
  allClear: "Nothing left to send",
  doneLead: "Everything has arrived. Thank you. Your broker will review it.",
  fileSection: "The file",
  close: "Close",
  official: "Official source",
  steps: "How to get it",
  save: "Save",
  phone: "Phone",
  email: "Email",
  address: "Current address",
  newLink: "Email me a new link",
  linkNote: "This link is your sign-in. No account or password.",
  demoFoot: "Demo only. Files stay in this browser.",
  sent: "Sent to your broker",
  tooBig: "Each file has to be 20 MB or less.",
  saved: "Saved",
  linkBlurb: "The link works once and expires in 15 minutes. If it expires, request a new one here."
};
var FA = {
  hello: function (n) { return "سلام " + n; },
  intro: "مشاور وام‌تان مدارک زیر را لازم دارد. هر کدام را در جای خودش بفرستید.",
  needed: "مانده",
  received: "رسیده",
  accepted: "قبول شد",
  rejected: "باید اصلاح شود",
  upload: "بارگذاری",
  takePhoto: "گرفتن عکس",
  chooseFile: "انتخاب فایل",
  addFile: "افزودن فایل دیگر",
  still: function (n) { return n + " مورد مانده"; },
  allClear: "چیزی باقی نمانده",
  doneLead: "همه مدارک رسیده. ممنون. مشاور وام آن‌ها را بررسی می‌کند.",
  fileSection: "مدارک پرونده",
  close: "بستن",
  official: "منبع رسمی",
  steps: "چطور تهیه کنید",
  save: "ذخیره",
  phone: "تلفن",
  email: "ایمیل",
  address: "نشانی فعلی",
  newLink: "لینک تازه برایم بفرست",
  linkNote: "با همین لینک وارد شده‌اید. حساب و رمز نمی‌خواهد.",
  demoFoot: "نسخه آزمایشی. فایل‌ها از همین مرورگر بیرون نمی‌روند.",
  sent: "برای مشاور وام فرستاده شد",
  tooBig: "هر فایل حداکثر ۲۰ مگابایت است.",
  saved: "ذخیره شد",
  linkBlurb: "لینک یک‌بار مصرف است و ۱۵ دقیقه اعتبار دارد. اگر منقضی شد، همین‌جا لینک تازه بگیرید."
};

function t(lang, key, arg) {
  var pack = lang === "fa" ? FA : EN;
  var v = pack[key];
  return typeof v === "function" ? v(arg) : v;
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function uid() { return Math.random().toString(36).slice(2, 10); }
function daysAgo(n) { return Date.now() - n * DAY; }
function sessionValid() {
  var s = state && state.session;
  if (!s || !s.signedInAt) return false;
  return Date.now() - s.signedInAt < 30 * DAY;
}
function brokerEmail() {
  return (state && state.session && state.session.email) || "broker@example.com";
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}
function parseRoute() {
  var raw = (location.hash || "#signin").replace(/^#/, "");
  var parts = raw.split("/").filter(Boolean);
  return { top: parts[0] || "signin", parts: parts, key: location.hash || "#signin" };
}
function go(hash, sheet) {
  if (sheet) ui.sheet = sheet;
  if ((location.hash || "#") === hash) render();
  else {
    ui.keepSheet = !!sheet;
    location.hash = hash;
  }
}
function toast(msg) {
  ui.toast = msg;
  clearTimeout(ui.toastTimer);
  ui.toastTimer = setTimeout(function () { ui.toast = ""; render(); }, 2600);
  render();
}
function fmt(ts, lang) {
  var d = new Date(ts);
  var today = new Date();
  var a = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  var b = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  if (a === b) return lang === "fa" ? "امروز" : "Today";
  if (b - a === DAY) return lang === "fa" ? "دیروز" : "Yesterday";
  try {
    return d.toLocaleDateString(lang === "fa" ? "fa-IR" : "en-CA", { month: "short", day: "numeric" });
  } catch (e) {
    return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
  }
}
function personName(person, lang) {
  if (!person) return "";
  return lang === "fa" && person.nameFa ? person.nameFa : person.name;
}
function firstName(person, lang) {
  return personName(person, lang).split(" ")[0] || "";
}
function findApplicant(c, id) {
  return (c.applicants || []).filter(function (a) { return a.id === id; })[0] || null;
}
function asCustom(lib) {
  var how = (lib.howTo || "").split(/\n+/).filter(Boolean);
  var desc = lib.description || "";
  return {
    id: lib.id,
    custom: true,
    perApplicant: !!lib.perApplicant,
    ifApplicable: false,
    capture: false,
    kind: "upload",
    sources: lib.sourceUrl ? [{ name: lib.sourceName || lib.sourceUrl, nameFa: lib.sourceName || lib.sourceUrl, url: lib.sourceUrl }] : [],
    en: {
      name: lib.name,
      lead: desc || "Your broker added this item.",
      steps: how.length ? how : ["Ask your broker if you are not sure where this comes from."],
      note: "Your broker wrote this note. It is saved in their library on this device."
    },
    fa: {
      name: lib.name,
      lead: desc || "مشاور وام این مورد را اضافه کرده است.",
      steps: how.length ? how : ["اگر نمی‌دانید این مدرک را از کجا بگیرید، از مشاور وام بپرسید."],
      note: "این راهنما را مشاور وام نوشته و ترجمه نشده است."
    }
  };
}
function resolve(docId, item) {
  var built = MYDOCS_CATALOG.filter(function (d) { return d.id === docId; })[0];
  if (built) return built;
  var lib = ((state && state.library) || []).filter(function (d) { return d.id === docId; })[0];
  if (lib) return asCustom(lib);
  if (item && item.snapshot) return asCustom(item.snapshot);
  return {
    id: docId, custom: true, perApplicant: false, capture: false, kind: "upload", sources: [],
    en: { name: "Document", lead: "", steps: [], note: "" },
    fa: { name: "مدرک", lead: "", steps: [], note: "" }
  };
}
function pack(doc, lang) { return lang === "fa" ? doc.fa : doc.en; }
function itemLabel(c, item, lang) {
  var doc = resolve(item.docId, item);
  var name = pack(doc, lang).name;
  var person = findApplicant(c, item.applicantId);
  return person ? name + " — " + personName(person, lang) : name;
}
function itemOrder(item) {
  var i = -1;
  MYDOCS_CATALOG.forEach(function (d, idx) { if (d.id === item.docId) i = idx; });
  return i === -1 ? 1000 : i;
}
function byOrder(a, b) { return itemOrder(a) - itemOrder(b); }
function stats(c) {
  var items = c.items || [];
  var accepted = items.filter(function (i) { return i.status === "Accepted"; }).length;
  var received = items.filter(function (i) { return i.status !== "Missing" && i.status !== "Rejected"; }).length;
  var outstanding = items.filter(function (i) { return i.status === "Missing" || i.status === "Rejected"; });
  var label = "Not started";
  if (items.length && accepted === items.length) label = "Complete";
  else if (items.length && !outstanding.length) label = "Ready for review";
  else if (received || outstanding.some(function (i) { return i.status === "Rejected"; })) label = "In progress";
  return { total: items.length, accepted: accepted, received: received, outstanding: outstanding, label: label };
}
function log(c, text) {
  c.activity = c.activity || [];
  c.activity.unshift({ at: Date.now(), text: text });
}
function emailShell(partial) {
  var base = {
    from: FROM,
    to: "",
    subject: "",
    paragraphs: [],
    list: [],
    link: null,
    rtl: false,
    footnote: "Demo only. Nothing was sent.",
    action: null,
    clientId: null
  };
  Object.keys(partial || {}).forEach(function (k) { base[k] = partial[k]; });
  return base;
}
function portalLink(c) {
  return { href: "#client/" + c.id, text: "https://demo.mydocs.ca/#client/" + c.id };
}
function missingLines(c, lang) {
  return stats(c).outstanding.map(function (item) {
    var line = itemLabel(c, item, lang);
    if (item.status === "Rejected" && item.reason) {
      line += lang === "fa" ? " — اصلاح: \u2068" + item.reason + "\u2069" : " — fix: " + item.reason;
    }
    return line;
  });
}
function reminderEmail(c) {
  var lang = c.lang === "fa" ? "fa" : "en";
  var lines = missingLines(c, lang);
  if (lang === "fa") {
    return emailShell({
      rtl: true,
      to: c.email,
      clientId: c.id,
      subject: "مدارکی که هنوز مانده",
      paragraphs: [
        "سلام " + firstName(c.applicants[0], "fa") + "،",
        "برای پرونده وام هنوز این‌ها مانده. هر کدام را در همان جای خودش بفرستید.",
        "وقتی همه‌چیز قبول شد، این یادآوری‌ها قطع می‌شود."
      ],
      list: lines,
      link: portalLink(c)
    });
  }
  return emailShell({
    to: c.email,
    clientId: c.id,
    subject: "Still needed for your mortgage file",
    paragraphs: [
      "Hi " + firstName(c.applicants[0], "en") + ",",
      "These items are still missing from your mortgage file. Upload each one into its own place.",
      "Reminders stop once nothing is left for you to send."
    ],
    list: lines,
    link: portalLink(c)
  });
}
function inviteEmail(c) {
  var lang = c.lang === "fa" ? "fa" : "en";
  var seen = {};
  var lines = [];
  c.items.forEach(function (item) {
    if (seen[item.docId]) {
      if (item.applicantId) seen[item.docId].people.push(personName(findApplicant(c, item.applicantId), lang));
      return;
    }
    var doc = resolve(item.docId, item);
    seen[item.docId] = { name: pack(doc, lang).name, people: item.applicantId ? [personName(findApplicant(c, item.applicantId), lang)] : [] };
  });
  Object.keys(seen).forEach(function (id) {
    var g = seen[id];
    lines.push(g.people.length ? g.name + " — " + g.people.join(lang === "fa" ? "، " : ", ") : g.name);
  });
  if (lang === "fa") {
    return emailShell({
      rtl: true,
      to: c.email,
      clientId: c.id,
      subject: "فهرست مدارک شما در MyDocs",
      paragraphs: [
        "مشاور وام یک فهرست برای شما ساخته است.",
        "لینک یک‌بار مصرف است و ۱۵ دقیقه اعتبار دارد. هر وقت خواستید از همان صفحه لینک تازه بگیرید. حساب و رمز لازم نیست."
      ],
      list: lines,
      link: portalLink(c)
    });
  }
  return emailShell({
    to: c.email,
    clientId: c.id,
    subject: "Your document checklist",
    paragraphs: [
      "Your broker set up a checklist for you.",
      "The link works once and expires in 15 minutes. You can request a fresh one from the page any time. There is no account and no password."
    ],
    list: lines,
    link: portalLink(c)
  });
}
function rejectionEmail(c, item) {
  var lang = c.lang === "fa" ? "fa" : "en";
  var label = itemLabel(c, item, lang);
  if (lang === "fa") {
    return emailShell({
      rtl: true,
      to: c.email,
      clientId: c.id,
      subject: "یک مدرک باید دوباره فرستاده شود",
      paragraphs: [
        "مشاور وام این مورد را برگرداند: " + label,
        item.reason || "لطفاً یک فایل تازه بفرستید.",
        "از همان لینک وارد شوید. اگر لینک منقضی شده، از صفحه یک لینک تازه بگیرید."
      ],
      link: portalLink(c)
    });
  }
  return emailShell({
    to: c.email,
    clientId: c.id,
    subject: "Please send a document again",
    paragraphs: [
      "Your broker sent this back: " + label,
      item.reason || "Please upload a new file.",
      "Open your checklist and replace it. The link expires in 15 minutes. You can request a new one from the page."
    ],
    link: portalLink(c)
  });
}
function uploadEmail(c, item) {
  return emailShell({
    to: brokerEmail(),
    clientId: c.id,
    subject: "New upload from " + c.name,
    paragraphs: [c.name + " uploaded " + itemLabel(c, item, "en") + "."],
    link: { href: "#broker/c/" + c.id, text: "https://demo.mydocs.ca/#broker/c/" + c.id },
    footnote: "Demo only. Nothing was sent. In the real product this is one email per 10 minutes per client, plus a daily digest."
  });
}
function signInEmail() {
  return emailShell({
    to: ui.signEmail || "broker@example.com",
    subject: "Your MyDocs sign-in link",
    paragraphs: [
      "Use the link below to open your client list. It works once and expires in 15 minutes.",
      "You’ll stay signed in on this device for 30 days. Signing in on a new device also sends you an alert."
    ],
    link: { href: "#broker", text: "https://demo.mydocs.ca/#broker" },
    action: { act: "open-magic", label: "Open the link" }
  });
}
function freshLinkEmail(c) {
  var lang = c.lang === "fa" ? "fa" : "en";
  if (lang === "fa") {
    return emailShell({
      rtl: true,
      to: c.email,
      clientId: c.id,
      subject: "لینک تازه MyDocs",
      paragraphs: ["این لینک یک‌بار مصرف است و ۱۵ دقیقه اعتبار دارد. حساب و رمز لازم نیست."],
      link: portalLink(c)
    });
  }
  return emailShell({
    to: c.email,
    clientId: c.id,
    subject: "Your new MyDocs link",
    paragraphs: ["This link works once and expires in 15 minutes. There is no account and no password."],
    link: portalLink(c)
  });
}
function filesOf(names, at) {
  return names.map(function (name) { return { name: name, at: at }; });
}
function placeholderFiles(doc, person) {
  if (doc.kind === "form") return [];
  var who = person ? "-" + person.name.split(" ")[0] : "";
  var at = daysAgo(10);
  if (doc.id === "dl") return filesOf(["DL" + who + "-front.jpg", "DL" + who + "-back.jpg"], at);
  return filesOf([doc.id.toUpperCase() + who + ".pdf"], at);
}
function checklist(type, applicants, overrides) {
  var fallback = overrides.__default || "Missing";
  var items = [];
  MYDOCS_CATALOG.forEach(function (doc) {
    if (doc.presets.indexOf(type) === -1) return;
    var people = doc.perApplicant ? applicants : [null];
    people.forEach(function (person) {
      var key = doc.id + ":" + (person ? person.id : "file");
      var o = overrides[key] || {};
      var status = o.status || fallback;
      var files = o.files;
      if (!files) files = status === "Missing" || doc.kind === "form" ? [] : placeholderFiles(doc, person);
      items.push({
        id: uid(),
        docId: doc.id,
        applicantId: person ? person.id : null,
        status: status,
        files: files,
        reason: o.reason || "",
        note: o.note || ""
      });
    });
  });
  return items;
}
function seed() {
  var now = Date.now();
  var reza = { id: "reza", name: "Reza Rahimi", nameFa: "رضا رحیمی" };
  var leila = { id: "leila", name: "Leila Rahimi", nameFa: "لیلا رحیمی" };
  var daniel = { id: "dan", name: "Daniel Rossi" };
  var sofia = { id: "sof", name: "Sofia Rossi" };
  var priya = { id: "priya", name: "Priya Sharma" };
  var marcus = { id: "marcus", name: "Marcus Lee" };
  var old = daysAgo(12);

  var rahimi = {
    id: "c_rahimi",
    name: "Reza & Leila Rahimi",
    email: "rahimi.demo@example.com",
    phone: "647-555-0148",
    type: "Purchase",
    lang: "fa",
    applicants: [reza, leila],
    contact: { phone: "647-555-0148", email: "rahimi.demo@example.com", address: "48 Elm Grove, Richmond Hill, ON" },
    createdAt: daysAgo(14),
    items: checklist("Purchase", [reza, leila], {
      "dl:reza": { status: "Accepted", files: filesOf(["DL-Reza-front.jpg", "DL-Reza-back.jpg"], old) },
      "t1:reza": { status: "Uploaded", files: filesOf(["T1-2024-Reza.pdf", "T1-2023-Reza.pdf"], daysAgo(2)) },
      "noa:reza": { status: "Accepted", files: filesOf(["NOA-2024-Reza.pdf", "NOA-2023-Reza.pdf"], old) },
      "emp:reza": { status: "Accepted", files: filesOf(["Employment-letter-Reza.pdf"], old) },
      "t4:reza": { status: "Accepted", files: filesOf(["T4-2024-Reza.pdf", "T4-2023-Reza.pdf"], old) },
      "pbank:reza": { status: "Uploaded", files: filesOf(["Chequing-Jul.pdf", "Chequing-Aug.pdf", "Chequing-Sep.pdf"], daysAgo(1)) },
      "dl:leila": { status: "Rejected", files: filesOf(["DL-Leila-back.jpg"], daysAgo(3)), reason: "The back is cut off. Please retake it in good light, with all four corners visible." },
      "sav:leila": { status: "Uploaded", files: filesOf(["TFSA-Jul.pdf", "TFSA-Aug.pdf", "TFSA-Sep.pdf"], daysAgo(2)) },
      "t4:leila": { status: "Rejected", files: filesOf(["paystub-Leila.pdf"], daysAgo(4)), reason: "This is a pay stub, not a T4. Please send the CRA T4 for each of the last 2 years." },
      "aps:file": { status: "Uploaded", files: filesOf(["APS-48-Elm-Grove.pdf"], daysAgo(1)) },
      "mls:file": { status: "Uploaded", files: filesOf(["MLS-N1234567.pdf"], daysAgo(1)) },
      "dep:file": { status: "Accepted", files: filesOf(["Trust-receipt.pdf"], old) },
      "contact:file": { status: "Accepted" }
    }),
    reminders: { enabled: true, firstAfterDays: 2, everyDays: 3, history: [] },
    activity: [
      { at: daysAgo(1), text: "Uploaded Purchase and sale agreement" },
      { at: daysAgo(3), text: "Rejected: Driver licence, front and back — Leila Rahimi" }
    ]
  };
  rahimi.reminders.history = [
    { at: daysAgo(9), kind: "auto", email: reminderEmail(rahimi) },
    { at: daysAgo(1), kind: "auto", email: reminderEmail(rahimi) }
  ];

  var rossi = {
    id: "c_rossi",
    name: "Daniel & Sofia Rossi",
    email: "rossi.demo@example.com",
    phone: "416-555-0198",
    type: "Purchase",
    lang: "en",
    applicants: [daniel, sofia],
    contact: { phone: "416-555-0198", email: "rossi.demo@example.com", address: "18 Crawford Street, Toronto, ON" },
    createdAt: daysAgo(21),
    items: checklist("Purchase", [daniel, sofia], {
      __default: "Accepted",
      "aps:file": { status: "Uploaded", files: filesOf(["APS-18-Crawford.pdf"], daysAgo(1)) },
      "mls:file": { status: "Uploaded", files: filesOf(["MLS-C887120.pdf"], daysAgo(1)) }
    }),
    reminders: { enabled: true, firstAfterDays: 2, everyDays: 3, history: [
      { at: daysAgo(16), kind: "auto", email: null }
    ] },
    activity: [{ at: daysAgo(1), text: "Uploaded MLS listing" }]
  };
  rossi.reminders.history[0].email = reminderEmail(Object.assign({}, rossi, {
    items: rossi.items.map(function (i) {
      if (i.docId === "aps" || i.docId === "mls") return Object.assign({}, i, { status: "Missing", files: [], reason: "" });
      return i;
    })
  }));

  var priyaC = {
    id: "c_priya",
    name: "Priya Sharma",
    email: "priya.demo@example.com",
    phone: "905-555-0164",
    type: "Self-employed",
    lang: "en",
    applicants: [priya],
    contact: { phone: "905-555-0164", email: "priya.demo@example.com", address: "220 Queen Street S, Mississauga, ON" },
    createdAt: daysAgo(6),
    items: checklist("Self-employed", [priya], {
      __default: "Accepted",
      "t2:file": { status: "Uploaded", files: filesOf(["T2-2024-Sharma-Design.pdf"], daysAgo(2)) },
      "cnoa:file": { status: "Missing" },
      "cbank:file": { status: "Uploaded", files: filesOf(["Operating-Apr.pdf", "Operating-May.pdf", "Operating-Jun.pdf", "Operating-Jul.pdf", "Operating-Aug.pdf", "Operating-Sep.pdf"], daysAgo(0)) },
      "cra:file": { status: "Missing" }
    }),
    reminders: { enabled: true, firstAfterDays: 2, everyDays: 3, history: [] },
    activity: [{ at: daysAgo(0), text: "Uploaded Company bank statements, 6 months" }]
  };
  priyaC.reminders.history = [{ at: daysAgo(1), kind: "manual", email: reminderEmail(priyaC) }];

  var marcusC = {
    id: "c_marcus",
    name: "Marcus Lee",
    email: "marcus.demo@example.com",
    phone: "604-555-0172",
    type: "Refinance",
    lang: "en",
    applicants: [marcus],
    contact: null,
    createdAt: daysAgo(6),
    items: checklist("Refinance", [marcus], {}),
    reminders: { enabled: true, firstAfterDays: 2, everyDays: 3, history: [] },
    activity: []
  };

  var priyaMail = uploadEmail(priyaC, priyaC.items.filter(function (i) { return i.docId === "cbank"; })[0]);
  var rahimiMail = uploadEmail(rahimi, rahimi.items.filter(function (i) { return i.docId === "aps"; })[0]);
  return {
    version: 2,
    session: null,
    library: [],
    clients: [rossi, rahimi, priyaC, marcusC],
    notifs: [
      { id: "n1", at: daysAgo(0), read: false, clientId: priyaC.id, title: priyaMail.subject, email: priyaMail },
      { id: "n2", at: daysAgo(1), read: false, clientId: rahimi.id, title: rahimiMail.subject, email: rahimiMail }
    ]
  };
}
function ensureClient(c) {
  c.reminders = c.reminders || { enabled: true, firstAfterDays: 2, everyDays: 3, history: [] };
  c.reminders.history = c.reminders.history || [];
  c.activity = c.activity || [];
  c.items = c.items || [];
  c.applicants = c.applicants || [];
  if (!c.lang) c.lang = "en";
}
function syncReminders() {
  var changed = false;
  state.clients.forEach(function (c) {
    ensureClient(c);
    var r = c.reminders;
    if (!r.enabled) return;
    var outstanding = stats(c).outstanding;
    if (!outstanding.length) return;
    var last = r.history.length ? r.history[r.history.length - 1].at : 0;
    var due = last ? last + r.everyDays * DAY : c.createdAt + r.firstAfterDays * DAY;
    if (Date.now() < due) return;
    var email = reminderEmail(c);
    r.history.push({ at: Date.now(), kind: "auto", email: email });
    log(c, "Automatic reminder emailed");
    changed = true;
  });
  return changed;
}
function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return null;
    var data = JSON.parse(raw);
    if (!data || data.version !== 2 || !Array.isArray(data.clients)) return null;
    data.library = data.library || [];
    data.notifs = data.notifs || [];
    data.clients.forEach(ensureClient);
    return data;
  } catch (e) {
    return null;
  }
}

function iconBack() {
  return '<svg class="back-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
}
function iconBell() {
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>';
}
function iconMore() {
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>';
}
function iconChev() {
  return '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
}
function iconFace() {
  return '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="6"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8"/></svg>';
}

function clientFromRoute(route) {
  if (!state.clients.length) return null;
  if (!route.parts[1]) return state.clients[0];
  return state.clients.filter(function (c) { return c.id === route.parts[1]; })[0] || null;
}
function brokerClient(route) {
  return state.clients.filter(function (c) { return c.id === route.parts[2]; })[0] || null;
}
function clientLangOf(route) {
  var c = clientFromRoute(route);
  return c && c.lang === "fa" ? "fa" : "en";
}
function activeClient() {
  var route = parseRoute();
  if (route.top === "client") return clientFromRoute(route);
  if (route.top === "broker" && route.parts[1] === "c") return brokerClient(route);
  return null;
}
function langSwitch(lang, act) {
  var note = lang === "fa" ? '<p class="review-note">Farsi translation<br>pending review</p>' : "";
  return '<div class="lang-wrap ltr"><div class="seg lang" role="group" aria-label="Language">' +
    '<button type="button" data-act="' + act + '" data-lang="en" aria-pressed="' + (lang !== "fa") + '">EN</button>' +
    '<button type="button" data-act="' + act + '" data-lang="fa" aria-pressed="' + (lang === "fa") + '">فارسی</button>' +
    '</div>' + note + '</div>';
}
function header(route) {
  var authed = sessionValid();
  var sub = route.top === "broker" && route.parts.length > 1 && route.parts[1] !== "passkey" && authed;
  var actions = "";
  if (route.top === "client") {
    actions = langSwitch(clientLangOf(route), "client-lang");
  } else if (authed && route.top === "broker" && route.parts[1] !== "passkey") {
    var unread = state.notifs.filter(function (n) { return !n.read; }).length;
    actions = '<a class="icon-btn" href="#broker/inbox" aria-label="Notifications">' + iconBell() +
      (unread ? '<span class="bell-count">' + unread + '</span>' : '') + '</a>' +
      '<button type="button" class="icon-btn" data-act="menu" aria-label="More">' + iconMore() + '</button>';
  }
  return '<header class="top">' +
    (sub ? '<a class="back" href="#broker" aria-label="Back">' + iconBack() + '</a>' : '') +
    '<div class="brand ltr"><span>MyDocs</span><span class="badge">DEMO · fake data</span></div>' +
    '<div class="top-actions">' + actions + '</div></header>';
}
function bar(pct) {
  var n = Math.max(0, Math.min(100, Math.round(pct)));
  return '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + n + '"><span style="width:' + n + '%"></span></div>';
}
function statusClass(status) {
  if (status === "Uploaded") return "uploaded";
  if (status === "Accepted") return "accepted";
  if (status === "Rejected") return "rejected";
  return "";
}
function statusText(status, lang, broker) {
  if (broker) {
    if (status === "Uploaded") return "To review";
    if (status === "Missing") return "Needed";
    if (status === "Rejected") return "Rejected";
    return "Accepted";
  }
  if (status === "Uploaded") return t(lang, "received");
  if (status === "Missing") return t(lang, "needed");
  if (status === "Rejected") return t(lang, "rejected");
  return t(lang, "accepted");
}

function renderSignin() {
  var face = state.session && state.session.passkeyEnabled;
  document.title = "Sign in · MyDocs";
  paint(
    '<div class="wrap signin"><h1>Sign in</h1>' +
    '<p class="lede">A link by email. No password, and no second code.</p>' +
    (face ? '<button type="button" class="btn" data-act="face-in">Use Face ID</button><p class="small muted" style="margin:10px 0 18px">Saved on this device. Or email a link instead.</p>' : '') +
    '<form data-form="signin"><label class="field"><span>Email</span>' +
    '<input id="sign-email" type="email" autocomplete="username" inputmode="email" value="' + esc(ui.signEmail) + '"></label>' +
    '<button class="btn" type="submit">Email me a sign-in link</button></form>' +
    '<p class="small muted">You’ll stay signed in on this device for 30 days.</p>' +
    '<p><button type="button" class="text-btn" data-act="reset-ask">Reset demo data</button></p>' +
    '<p><a href="#client">Look at a client checklist</a></p></div>'
  );
}
function renderPasskey() {
  document.title = "Face ID · MyDocs";
  paint(
    '<div class="wrap"><div class="face">' + iconFace() + '</div>' +
    '<h1>Use Face ID next time?</h1>' +
    '<p class="lede">A passkey stays on this iPhone, so the next sign-in is just Face ID. You can still ask for a link.</p>' +
    '<button type="button" class="btn" data-act="face-yes">Use Face ID</button>' +
    '<p><button type="button" class="text-btn" data-act="face-no">Not now</button></p>' +
    '<p class="small faint">Demo only. This does not create a real passkey.</p></div>'
  );
}
function renderList() {
  document.title = "Clients · MyDocs";
  var rows = state.clients.map(function (c) {
    var st = stats(c);
    var pct = st.total ? (st.accepted / st.total) * 100 : 0;
    return '<a class="person" href="#broker/c/' + c.id + '"><div class="row-between"><div class="stack"><strong>' + esc(c.name) + '</strong>' +
      '<span class="small muted">' + esc(c.type) + ' · ' + esc(st.label) + '</span></div>' + iconChev() + '</div>' +
      bar(pct) + '<span class="small muted">' + st.accepted + ' of ' + st.total + ' accepted</span></a>';
  }).join("");
  paint(
    '<div class="wrap"><div class="row-between"><h1>Clients</h1>' +
    '<a class="text-btn" href="#broker/new" data-act="new-client">New</a></div>' +
    '<div class="list">' + rows + '</div></div>'
  );
}
function renderInbox() {
  document.title = "Notifications · MyDocs";
  var rows = state.notifs.map(function (n) {
    return '<button type="button" class="note-row" data-act="open-notif" data-id="' + esc(n.id) + '"><strong>' + esc(n.title) + '</strong>' +
      '<div class="small muted">' + esc(fmt(n.at, "en")) + (n.read ? "" : " · New") + '</div></button>';
  }).join("");
  paint('<div class="wrap"><h1>Notifications</h1><p class="lede">Uploads land here, and as email from MyDocs.</p><div class="list">' +
    (rows || '<p class="person muted">Nothing yet.</p>') + '</div></div>');
}
function choiceMeta(id) {
  var built = MYDOCS_CATALOG.filter(function (d) { return d.id === id; })[0];
  if (built) return { id: id, name: built.en.name, perApplicant: built.perApplicant, ifApplicable: built.ifApplicable, custom: false };
  var lib = state.library.filter(function (d) { return d.id === id; })[0];
  if (lib) return { id: id, name: lib.name, perApplicant: !!lib.perApplicant, ifApplicable: false, custom: true };
  return null;
}
function presetSet(type) {
  var set = {};
  MYDOCS_CATALOG.forEach(function (d) { if (d.presets.indexOf(type) !== -1) set[d.id] = true; });
  return set;
}
function freshDraft() {
  var d = { name: "", email: "", phone: "", type: "Purchase", applicants: [""], selected: presetSet("Purchase") };
  if (ui.justAdded) { d.selected[ui.justAdded] = true; ui.justAdded = ""; }
  return d;
}
function renderNew() {
  if (!draft) draft = freshDraft();
  document.title = "New client · MyDocs";
  var groups = [
    { title: "For each applicant", test: function (m) { return m.perApplicant && !m.ifApplicable; } },
    { title: "For the file", test: function (m) { return !m.perApplicant && !m.ifApplicable; } },
    { title: "If they apply", test: function (m) { return m.ifApplicable; } }
  ];
  var choices = MYDOCS_CATALOG.map(function (d) { return d.id; }).concat(state.library.map(function (d) { return d.id; }));
  var html = groups.map(function (g) {
    var rows = choices.map(choiceMeta).filter(function (m) { return m && g.test(m); }).map(function (m) {
      var on = !!draft.selected[m.id];
      return '<div class="checkline"><button type="button" class="switch" role="switch" aria-checked="' + on + '" data-act="toggle-doc" data-id="' + esc(m.id) + '" aria-label="' + esc(m.name) + '"><i></i></button>' +
        '<div class="grow"><strong>' + esc(m.name) + '</strong>' +
        (m.custom ? ' <span class="small faint">Custom</span>' : '') +
        (m.perApplicant ? '<div class="small muted">One request per applicant</div>' : '') +
        '</div><button type="button" class="help" data-act="help" data-doc="' + esc(m.id) + '" aria-label="How to get ' + esc(m.name) + '">?</button></div>';
    }).join("");
    return rows ? '<p class="kicker">' + g.title + '</p><div class="card" style="padding:6px 14px">' + rows + '</div>' : '';
  }).join("");
  var apps = draft.applicants.map(function (name, i) {
    return '<div class="inline" style="margin-bottom:8px"><input data-field="applicant" data-index="' + i + '" value="' + esc(name) + '" placeholder="Given and family name" aria-label="Applicant ' + (i + 1) + '">' +
      (draft.applicants.length > 1 ? '<button type="button" class="text-btn" data-act="rm-app" data-index="' + i + '">Remove</button>' : '') + '</div>';
  }).join("");
  paint(
    '<div class="wrap pad-sticky"><h1>New client</h1><p class="lede">A portal link goes out as soon as you send this.</p>' +
    (ui.error ? '<p class="error">' + esc(ui.error) + '</p>' : '') +
    '<label class="field"><span>Names on the file</span><input data-field="name" value="' + esc(draft.name) + '" placeholder="Reza & Leila Rahimi"></label>' +
    '<label class="field"><span>Email</span><input data-field="email" type="email" value="' + esc(draft.email) + '" placeholder="name@email.com"></label>' +
    '<label class="field"><span>Phone</span><input data-field="phone" type="tel" value="' + esc(draft.phone) + '" placeholder="416-555-0100"></label>' +
    '<p class="lbl">Applicants, up to 3</p>' + apps +
    (draft.applicants.length < 3 ? '<button type="button" class="text-btn" data-act="add-app">Add applicant</button>' : '') +
    '<p class="lbl" style="margin-top:18px">Deal</p><div class="seg">' +
    ["Purchase", "Refinance", "Self-employed"].map(function (type) {
      return '<button type="button" data-act="deal" data-type="' + type + '" aria-pressed="' + (draft.type === type) + '">' + type + '</button>';
    }).join("") + '</div>' + html +
    '<p><button type="button" class="text-btn" data-act="goto-custom">New custom document</button></p>' +
    '<p class="small muted">Custom documents are saved on this device and appear for every new client.</p></div>' +
    '<div class="sticky"><div class="sticky-inner"><button type="button" class="btn" data-act="create">Send portal link</button>' +
    '<p>You’ll see the email before it “sends”.</p></div></div>'
  );
}
function renderCustom(id) {
  if (!customDraft || customDraft.editId !== (id || "")) {
    var existing = id ? state.library.filter(function (d) { return d.id === id; })[0] : null;
    customDraft = existing ? {
      editId: existing.id, name: existing.name, description: existing.description || "",
      perApplicant: !!existing.perApplicant, howTo: existing.howTo || "",
      sourceName: existing.sourceName || "", sourceUrl: existing.sourceUrl || ""
    } : { editId: "", name: "", description: "", perApplicant: true, howTo: "", sourceName: "", sourceUrl: "" };
  }
  document.title = "Custom document · MyDocs";
  paint(
    '<div class="wrap pad-sticky"><h1>' + (customDraft.editId ? "Edit document" : "Custom document") + '</h1>' +
    '<p class="lede">Saved to your library, then offered on every new client.</p>' +
    (ui.error ? '<p class="error">' + esc(ui.error) + '</p>' : '') +
    '<label class="field"><span>Name</span><input data-field="lib-name" value="' + esc(customDraft.name) + '" placeholder="Void cheque"></label>' +
    '<label class="field"><span>Description, optional</span><input data-field="lib-desc" value="' + esc(customDraft.description) + '" placeholder="Shown to the client"></label>' +
    '<p class="lbl">Ask for it</p><div class="seg">' +
    '<button type="button" data-act="scope" data-scope="applicant" aria-pressed="' + (!!customDraft.perApplicant) + '">Each applicant</button>' +
    '<button type="button" data-act="scope" data-scope="file" aria-pressed="' + (!customDraft.perApplicant) + '">One for the file</button></div>' +
    '<label class="field" style="margin-top:14px"><span>How the client gets it, optional</span><textarea data-field="lib-how" placeholder="Where it comes from, in a sentence or two.">' + esc(customDraft.howTo) + '</textarea></label>' +
    '<label class="field"><span>Official source name, optional</span><input data-field="lib-src-name" value="' + esc(customDraft.sourceName) + '" placeholder="City of Toronto"></label>' +
    '<label class="field"><span>Official source link, optional</span><input data-field="lib-src-url" type="url" inputmode="url" value="' + esc(customDraft.sourceUrl) + '" placeholder="https://"></label></div>' +
    '<div class="sticky"><div class="sticky-inner"><button type="button" class="btn" data-act="save-custom">Save to library</button></div></div>'
  );
}
function renderLibrary() {
  document.title = "Library · MyDocs";
  var rows = state.library.map(function (d) {
    return '<div class="person"><div class="row-between"><div class="stack"><strong>' + esc(d.name) + '</strong>' +
      '<span class="small muted">' + (d.perApplicant ? "Each applicant" : "One for the file") + '</span></div>' +
      '<span class="inline"><a class="text-btn" href="#broker/custom/' + d.id + '" data-act="edit-lib" data-id="' + d.id + '">Edit</a>' +
      '<button type="button" class="text-btn" data-act="delete-lib" data-id="' + d.id + '">Delete</button></span></div></div>';
  }).join("");
  paint(
    '<div class="wrap"><div class="row-between"><h1>Library</h1><a class="text-btn" href="#broker/custom" data-act="new-lib">New</a></div>' +
    '<p class="lede">Built-in documents stay. These are yours, on this device.</p>' +
    '<div class="list">' + (rows || '<p class="person muted">No custom documents yet.</p>') + '</div></div>'
  );
}
function sectionsOf(c) {
  var sections = c.applicants.map(function (a) {
    return { title: null, person: a, items: c.items.filter(function (i) { return i.applicantId === a.id; }).slice().sort(byOrder) };
  });
  var fileItems = c.items.filter(function (i) { return !i.applicantId; }).slice().sort(byOrder);
  if (fileItems.length) sections.push({ title: "file", person: null, items: fileItems });
  return sections.filter(function (s) { return s.items.length; });
}
function helpBtn(docId, name) {
  return '<button type="button" class="help" data-act="help" data-doc="' + esc(docId) + '" aria-label="How to get ' + esc(name) + '">?</button>';
}
function renderBrokerItem(c, item) {
  var doc = resolve(item.docId, item);
  var name = doc.en.name;
  var files = (item.files || []).map(function (f) { return "<li>" + esc(f.name) + "</li>"; }).join("");
  var actions = "";
  if (item.status === "Uploaded" && doc.kind !== "form") {
    actions = '<div class="pair"><button type="button" class="btn" data-act="accept" data-item="' + item.id + '">Accept</button>' +
      '<button type="button" class="btn btn-quiet" data-act="reject" data-item="' + item.id + '">Reject</button></div>';
  }
  if (doc.kind === "form" && item.status === "Uploaded") {
    actions = '<div class="pair"><button type="button" class="btn" data-act="accept" data-item="' + item.id + '">Accept</button>' +
      '<button type="button" class="btn btn-quiet" data-act="reject" data-item="' + item.id + '">Reject</button></div>';
  }
  var contact = "";
  if (doc.kind === "form" && c.contact && item.status !== "Missing") {
    contact = '<div class="contact-view small"><p>' + esc(c.contact.phone || "") + '</p><p>' + esc(c.contact.email || "") + '</p><p>' + esc(c.contact.address || "") + '</p></div>';
  }
  return '<article class="card"><div class="card-top"><div class="stack"><h3>' + esc(name) + '</h3>' +
    '<span class="status ' + statusClass(item.status) + '">' + statusText(item.status, "en", true) + '</span></div>' +
    helpBtn(item.docId, name) + '</div>' + contact +
    (files ? '<ul class="files">' + files + '</ul>' : '') +
    (item.reason ? '<p class="reason">' + esc(item.reason) + '</p>' : '') +
    (item.note ? '<p class="small muted">' + esc(item.note) + '</p>' : '') +
    actions +
    '<button type="button" class="text-btn" data-act="note" data-item="' + item.id + '">' + (item.note ? "Edit note" : "Add note") + '</button></article>';
}
function renderDetail(c) {
  var st = stats(c);
  document.title = c.name + " · MyDocs";
  var pct = st.total ? (st.accepted / st.total) * 100 : 0;
  var body = sectionsOf(c).map(function (sec) {
    var title = sec.person ? personName(sec.person, "en") : "The file";
    return '<p class="kicker">' + esc(title) + '</p>' + sec.items.map(function (item) { return renderBrokerItem(c, item); }).join("");
  }).join("");
  var opts = OPT_IDS.map(function (id) {
    var doc = resolve(id);
    var on = c.items.some(function (i) { return i.docId === id; });
    return '<div class="toggle-row"><button type="button" class="switch" role="switch" aria-checked="' + on + '" data-act="opt" data-doc="' + id + '" aria-label="' + esc(doc.en.name) + '"><i></i></button>' +
      '<div class="grow">' + esc(doc.en.name) + '</div>' + helpBtn(id, doc.en.name) + '</div>';
  }).join("");
  var hist = (c.reminders.history || []).slice().reverse().map(function (h, idx) {
    var real = c.reminders.history.length - 1 - idx;
    return '<button type="button" class="note-row" data-act="hist" data-index="' + real + '"><strong>' + (h.kind === "auto" ? "Automatic" : "Sent now") + '</strong>' +
      '<div class="small muted">' + esc(fmt(h.at, "en")) + '</div></button>';
  }).join("");
  var chasing = st.outstanding.length > 0;
  paint(
    '<div class="wrap pad-sticky"><p class="small muted" style="margin-top:12px">' + esc(c.type) + ' · ' + esc(st.label) + '</p>' +
    '<h1>' + esc(c.name) + '</h1>' +
    '<p class="muted" style="margin-top:0">' + esc(c.email) + ' · ' + esc(c.phone || "") + '</p>' +
    '<a href="#client/' + c.id + '" data-act="preview" data-id="' + c.id + '">View as client</a>' +
    bar(pct) + '<p class="small muted">' + st.accepted + ' of ' + st.total + ' accepted</p>' +
    body +
    '<p class="kicker">If they apply</p><div class="card" style="padding:8px 14px">' + opts + '</div>' +
    '<p class="kicker">Reminders</p><div class="card"><div class="row-between"><div><strong>Automatic</strong>' +
    '<div class="small muted">On by default. Stops when nothing is missing.</div></div>' +
    '<button type="button" class="switch" role="switch" aria-checked="' + (!!c.reminders.enabled) + '" data-act="rem-on"><i></i></button></div>' +
    '<div class="inline" style="margin-top:14px"><span class="small">First reminder after</span><input class="num" type="number" min="1" max="30" data-field="rem-first" value="' + c.reminders.firstAfterDays + '"><span class="small">days</span></div>' +
    '<div class="inline" style="margin-top:10px"><span class="small">Then every</span><input class="num" type="number" min="1" max="30" data-field="rem-every" value="' + c.reminders.everyDays + '"><span class="small">days</span></div>' +
    '<p class="small muted">While something is still missing or was sent back.</p></div>' +
    (hist ? '<div class="list">' + hist + '</div>' : '<p class="small muted">No reminders yet.</p>') +
    '<p class="kicker">Activity</p><div class="list">' +
    ((c.activity || []).slice(0, 8).map(function (a) {
      return '<div class="person"><strong class="small">' + esc(a.text) + '</strong><div class="small muted">' + esc(fmt(a.at, "en")) + '</div></div>';
    }).join("") || '<p class="person muted">Nothing logged yet.</p>') +
    '</div><p><button type="button" class="text-btn" data-act="download">Download all</button></p></div>' +
    (chasing ? '<div class="sticky"><div class="sticky-inner"><button type="button" class="btn" data-act="remind">Remind now</button><p>Sends a list of exactly what is still missing.</p></div></div>' : '')
  );
}
function fileInput(item, capture, lang) {
  if (capture) {
    return '<label class="btn">' + t(lang, "takePhoto") +
      '<input class="hidden-file" type="file" accept="image/*,.heic,.heif" capture="environment" data-act="upload" data-item="' + item.id + '"></label>' +
      '<label class="text-btn">' + t(lang, "chooseFile") +
      '<input class="hidden-file" type="file" accept="image/*,.jpg,.jpeg,.png,.heic,.heif,.pdf,application/pdf" multiple data-act="upload" data-item="' + item.id + '"></label>';
  }
  var label = item.status === "Uploaded" ? t(lang, "addFile") : t(lang, "upload");
  return '<label class="btn">' + label +
    '<input class="hidden-file" type="file" accept="image/*,.jpg,.jpeg,.png,.heic,.heif,.pdf,application/pdf" multiple data-act="upload" data-item="' + item.id + '"></label>';
}
function renderClientItem(c, item, lang) {
  var doc = resolve(item.docId, item);
  var copy = pack(doc, lang);
  var files = (item.files || []).map(function (f) { return "<li>" + esc(f.name) + "</li>"; }).join("");
  var open = item.status === "Missing" || item.status === "Rejected" || item.status === "Uploaded";
  var body = "";
  if (doc.kind === "form") {
    if (item.status === "Accepted") {
      body = '<div class="contact-view"><p>' + esc(c.contact.phone) + '</p><p>' + esc(c.contact.email) + '</p><p>' + esc(c.contact.address) + '</p></div>';
    } else {
      var ct = contactDraft(c);
      body = '<label class="field"><span>' + t(lang, "phone") + '</span><input data-field="ct-phone" value="' + esc(ct.phone) + '"></label>' +
        '<label class="field"><span>' + t(lang, "email") + '</span><input data-field="ct-email" type="email" value="' + esc(ct.email) + '"></label>' +
        '<label class="field"><span>' + t(lang, "address") + '</span><input data-field="ct-address" value="' + esc(ct.address) + '"></label>' +
        '<button type="button" class="btn" data-act="save-contact" data-item="' + item.id + '">' + t(lang, "save") + '</button>';
    }
  } else if (open && item.status !== "Uploaded") {
    body = fileInput(item, !!doc.capture, lang);
  } else if (item.status === "Uploaded") {
    body = fileInput(item, !!doc.capture, lang);
  }
  return '<article class="card"><div class="card-top"><div class="stack"><h3>' + esc(copy.name) + '</h3>' +
    '<span class="status ' + statusClass(item.status) + '">' + statusText(item.status, lang, false) + '</span></div>' +
    helpBtn(item.docId, copy.name) + '</div>' +
    (item.note ? '<p class="small muted">' + esc(item.note) + '</p>' : '') +
    (item.reason && item.status === "Rejected" ? '<p class="reason">' + esc(item.reason) + '</p>' : '') +
    (files ? '<ul class="files">' + files + '</ul>' : '') + body + '</article>';
}
function renderClient(route) {
  var c = clientFromRoute(route);
  if (!c) {
    document.title = "MyDocs";
    paint('<div class="wrap"><h1>File not found</h1><p><a href="#client">Open a checklist</a></p></div>');
    return;
  }
  var lang = c.lang === "fa" ? "fa" : "en";
  var st = stats(c);
  var pct = st.total ? (st.received / st.total) * 100 : 0;
  var preview = sessionStorage.getItem("mydocs-preview") === c.id && sessionValid();
  document.title = (lang === "fa" ? "مدارک" : "Checklist") + " · MyDocs";
  var body = sectionsOf(c).map(function (sec) {
    var title = sec.person ? personName(sec.person, lang) : t(lang, "fileSection");
    return '<p class="kicker">' + esc(title) + '</p>' + sec.items.map(function (item) { return renderClientItem(c, item, lang); }).join("");
  }).join("");
  var left = st.outstanding.length;
  paint(
    '<div class="wrap pad-sticky">' +
    (preview ? '<div class="preview-bar ltr"><a href="#broker/c/' + c.id + '" data-act="end-preview">Back to file</a><span>Preview</span></div>' : '') +
    '<h1>' + esc(t(lang, "hello", firstName(c.applicants[0], lang))) + '</h1>' +
    '<p class="lede">' + esc(t(lang, "intro")) + '</p>' +
    bar(pct) +
    '<p class="muted">' + esc(left ? t(lang, "still", left) : t(lang, "doneLead")) + '</p>' +
    body +
    '<p class="small muted">' + esc(t(lang, "linkNote")) + ' ' + esc(t(lang, "linkBlurb")) + '</p>' +
    '<p><button type="button" class="text-btn" data-act="fresh-link">' + esc(t(lang, "newLink")) + '</button></p>' +
    '<p class="small faint">' + esc(t(lang, "demoFoot")) + '</p></div>' +
    '<div class="sticky"><div class="sticky-inner">' + bar(pct) +
    '<p>' + esc(left ? t(lang, "still", left) : t(lang, "allClear")) + '</p></div></div>'
  );
}
function renderMissing() {
  paint('<div class="wrap"><h1>That file is not in this demo.</h1><p><a href="#broker">Back to clients</a></p></div>');
}

function sheetHtml() {
  if (!ui.sheet) return "";
  var s = ui.sheet;
  if (s.type === "email") return emailSheet(s.email);
  if (s.type === "help") return helpSheet(s);
  if (s.type === "reject") return rejectSheet(s);
  if (s.type === "note") return noteSheet(s);
  if (s.type === "menu") return menuSheet();
  if (s.type === "confirm-reset") return confirmSheet("Reset demo data?", "This clears the clients, the library, and the sign-in on this device.", "reset-yes", "Reset");
  if (s.type === "confirm-delete") return confirmSheet("Delete this document?", "It leaves your library. Files already requested stay on those clients.", "delete-yes", "Delete");
  if (s.type === "info") return infoSheet(s.title, s.body);
  return "";
}
function frame(dir, inner) {
  return '<button type="button" class="backdrop" data-act="close" aria-label="Close"></button>' +
    '<div class="sheet" role="dialog" aria-modal="true" dir="' + dir + '" lang="' + (dir === "rtl" ? "fa" : "en") + '">' +
    '<div class="grab"></div>' + inner + '</div>';
}
function emailSheet(email) {
  var dir = email.rtl ? "rtl" : "ltr";
  var list = (email.list || []).length ? "<ul>" + email.list.map(function (li) { return "<li>" + esc(li) + "</li>"; }).join("") + "</ul>" : "";
  var paras = (email.paragraphs || []).map(function (p) { return "<p dir=\"auto\">" + esc(p) + "</p>"; }).join("");
  var link = email.link ? '<a class="linkish ltr" href="' + esc(email.link.href) + '">' + esc(email.link.text) + '</a>' : "";
  var action = email.action ? '<button type="button" class="btn" data-act="' + email.action.act + '">' + esc(email.action.label) + '</button>' : "";
  var open = email.clientId ? '<p><button type="button" class="text-btn" data-act="open-client" data-id="' + esc(email.clientId) + '">Open file</button></p>' : "";
  return frame(dir,
    '<p class="meta"><span class="muted">From</span><br><b class="ltr">' + esc(email.from || FROM) + '</b></p>' +
    '<p class="meta"><span class="muted">To</span><br><b class="ltr">' + esc(email.to) + '</b></p>' +
    '<p class="meta"><span class="muted">Subject</span><br><b>' + esc(email.subject) + '</b></p><hr class="hr">' +
    '<div class="email-body">' + paras + list + link + '</div>' +
    action + open +
    '<p class="small faint">' + esc(email.footnote || "Demo only. Nothing was sent.") + '</p>' +
    '<button type="button" class="text-btn" data-act="close">Close</button>'
  );
}
function helpSheet(s) {
  var doc = resolve(s.docId, s.item);
  var lang = s.lang === "fa" ? "fa" : "en";
  var copy = pack(doc, lang);
  var steps = (copy.steps || []).map(function (step) { return "<li>" + esc(step) + "</li>"; }).join("");
  var sources = (doc.sources || []).map(function (src) {
    var label = lang === "fa" ? src.nameFa : src.name;
    return '<a class="source" href="' + esc(src.url) + '" target="_blank" rel="noopener noreferrer"><span class="source-name">' + esc(label) + '</span><span class="source-url" dir="ltr">' + esc(src.url) + '</span></a>';
  }).join("");
  var hideSources = !sources && !doc.custom && doc.kind !== "form";
  var empty = sources ? "" : '<p class="small muted">' + (doc.custom
    ? (lang === "fa" ? "لینک منبع رسمی برای این مورد ثبت نشده." : "No official link was added for this item.")
    : (lang === "fa" ? "صفحه رسمی برای این مورد نیست. همین‌جا وارد می‌کنید." : "There is no official page for this item. You enter it here.")) + "</p>";
  return frame(lang === "fa" ? "rtl" : "ltr",
    langSwitch(lang, "help-lang") +
    '<h2>' + esc(copy.name) + '</h2>' + (copy.lead ? '<p>' + esc(copy.lead) + '</p>' : '') +
    (hideSources ? '' : '<p class="kicker">' + esc(t(lang, "official")) + '</p>' + (sources || empty)) +
    (steps ? '<p class="kicker">' + esc(t(lang, "steps")) + '</p><ol>' + steps + '</ol>' : '') +
    (copy.note ? '<div class="callout">' + esc(copy.note) + '</div>' : '') +
    '<button type="button" class="text-btn" data-act="close">' + esc(t(lang, "close")) + '</button>'
  );
}
function rejectSheet(s) {
  return frame("ltr",
    '<h2>Send it back</h2><p class="lede">The client gets an email with this reason.</p>' +
    (ui.error ? '<p class="error">' + esc(ui.error) + '</p>' : '') +
    '<label class="field"><span>Reason</span><textarea id="reject-reason" placeholder="The back of the licence is cut off.">' + esc(s.reason || "") + '</textarea></label>' +
    '<button type="button" class="btn" data-act="reject-send" data-item="' + esc(s.itemId) + '">Reject and email client</button>'
  );
}
function noteSheet(s) {
  return frame("ltr",
    '<h2>Note for the client</h2>' +
    '<label class="field"><span>Note</span><textarea id="item-note">' + esc(s.text || "") + '</textarea></label>' +
    '<button type="button" class="btn" data-act="note-save" data-item="' + esc(s.itemId) + '">Save note</button>'
  );
}
function menuSheet() {
  return frame("ltr",
    '<h2>More</h2>' +
    '<a class="menu-item" href="#broker/library" data-act="close">Document library</a>' +
    '<button type="button" class="menu-item" data-act="sign-out">Sign out</button>' +
    '<button type="button" class="menu-item" data-act="reset-ask">Reset demo data</button>'
  );
}
function confirmSheet(title, body, act, label) {
  return frame("ltr",
    '<h2>' + esc(title) + '</h2><p class="lede">' + esc(body) + '</p>' +
    '<button type="button" class="btn" data-act="' + act + '">' + esc(label) + '</button>' +
    '<p><button type="button" class="text-btn" data-act="close">Cancel</button></p>'
  );
}
function infoSheet(title, body) {
  return frame("ltr", '<h2>' + esc(title) + '</h2><p>' + esc(body) + '</p><button type="button" class="text-btn" data-act="close">Close</button>');
}

function paint(body) {
  var route = parseRoute();
  var fa = route.top === "client" && clientLangOf(route) === "fa";
  document.documentElement.dir = fa ? "rtl" : "ltr";
  document.documentElement.lang = fa ? "fa" : "en";
  var keep = route.key === ui.lastKey;
  var y = keep ? window.scrollY : 0;
  ui.lastKey = route.key;
  document.getElementById("app").innerHTML = header(route) + body + sheetHtml() + (ui.toast ? '<div class="toast">' + esc(ui.toast) + '</div>' : '');
  document.documentElement.classList.toggle("sheet-open", !!ui.sheet);
  window.scrollTo(0, keep ? y : 0);
  var h = document.querySelector(".sheet h2");
  if (h) h.setAttribute("tabindex", "-1");
}
function render() {
  if (document.body) readFields();
  var route = parseRoute();
  if (route.top === "signin" && sessionValid()) {
    location.hash = ui.afterAuth && ui.afterAuth.indexOf("#broker") === 0 ? ui.afterAuth : "#broker";
    return;
  }
  if (route.top === "broker" && route.parts[1] === "passkey") {
    if (!sessionValid()) { renderSignin(); return; }
    if (state.session.passkeyOffered) { location.hash = "#broker"; return; }
    renderPasskey();
    return;
  }
  if (route.top === "broker" && !sessionValid()) {
    ui.afterAuth = location.hash;
    renderSignin();
    return;
  }
  if (route.top === "client") { renderClient(route); return; }
  if (route.top !== "broker") { renderSignin(); return; }
  var sub = route.parts[1] || "";
  if (!sub) renderList();
  else if (sub === "new") renderNew();
  else if (sub === "inbox") renderInbox();
  else if (sub === "library") renderLibrary();
  else if (sub === "custom") renderCustom(route.parts[2] || "");
  else if (sub === "c") {
    var c = brokerClient(route);
    if (!c) renderMissing();
    else renderDetail(c);
  } else renderList();
}

function validHttps(value) {
  try { return new URL(value).protocol === "https:"; } catch (e) { return false; }
}
function readFields() {
  document.querySelectorAll("[data-field]").forEach(function (el) {
    var f = el.dataset.field;
    if (!draft && f.indexOf("lib-") !== 0 && f.indexOf("ct-") !== 0 && f.indexOf("rem-") !== 0 && f !== "sign-email") {}
    if (f === "name" && draft) draft.name = el.value;
    if (f === "email" && draft) draft.email = el.value;
    if (f === "phone" && draft) draft.phone = el.value;
    if (f === "applicant" && draft) draft.applicants[Number(el.dataset.index)] = el.value;
    if (customDraft && f === "lib-name") customDraft.name = el.value;
    if (customDraft && f === "lib-desc") customDraft.description = el.value;
    if (customDraft && f === "lib-how") customDraft.howTo = el.value;
    if (customDraft && f === "lib-src-name") customDraft.sourceName = el.value;
    if (customDraft && f === "lib-src-url") customDraft.sourceUrl = el.value;
    if (f === "ct-phone" || f === "ct-email" || f === "ct-address") {
      var owner = activeClient();
      if (owner) {
        var draftContact = contactDraft(owner);
        if (f === "ct-phone") draftContact.phone = el.value;
        if (f === "ct-email") draftContact.email = el.value;
        if (f === "ct-address") draftContact.address = el.value;
      }
    }
    if (f === "rem-first" || f === "rem-every") {
      var remClient = activeClient();
      if (remClient && remClient.reminders) {
        var days = Math.max(1, Math.min(30, parseInt(el.value, 10) || 1));
        if (f === "rem-first") remClient.reminders.firstAfterDays = days;
        else remClient.reminders.everyDays = days;
      }
    }
  });
  var sign = document.getElementById("sign-email");
  if (sign) ui.signEmail = sign.value.trim() || "broker@example.com";
}
function createClient() {
  readFields();
  ui.error = "";
  if (!draft.name.trim()) { ui.error = "Add the names on the file."; render(); return; }
  if (!draft.email.trim() || draft.email.indexOf("@") === -1) { ui.error = "Add an email so the link has somewhere to go."; render(); return; }
  var names = draft.applicants.map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 3);
  if (!names.length) { ui.error = "Add at least one applicant."; render(); return; }
  var applicants = names.map(function (name) { return { id: uid(), name: name }; });
  var items = [];
  MYDOCS_CATALOG.concat(state.library.map(asCustom)).forEach(function (doc) {
    if (!draft.selected[doc.id]) return;
    var people = doc.perApplicant ? applicants : [null];
    people.forEach(function (p) {
      items.push({ id: uid(), docId: doc.id, applicantId: p ? p.id : null, status: "Missing", files: [], reason: "", note: "" });
    });
  });
  if (!items.length) { ui.error = "Choose at least one document."; render(); return; }
  var c = {
    id: uid(),
    name: draft.name.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    type: draft.type,
    lang: "en",
    applicants: applicants,
    contact: null,
    createdAt: Date.now(),
    items: items,
    reminders: { enabled: true, firstAfterDays: 2, everyDays: 3, history: [] },
    activity: [{ at: Date.now(), text: "File opened" }]
  };
  state.clients.unshift(c);
  draft = null;
  ui.error = "";
  save();
  go("#broker/c/" + c.id, { type: "email", email: inviteEmail(c) });
}
function saveCustom() {
  readFields();
  if (!customDraft.name.trim()) { ui.error = "Add a name."; render(); return; }
  if (customDraft.sourceUrl.trim() && !validHttps(customDraft.sourceUrl.trim())) {
    ui.error = "The source link has to start with https://";
    render();
    return;
  }
  var rec = {
    id: customDraft.editId || ("lib_" + uid()),
    name: customDraft.name.trim(),
    description: customDraft.description.trim(),
    perApplicant: !!customDraft.perApplicant,
    howTo: customDraft.howTo.trim(),
    sourceName: customDraft.sourceName.trim(),
    sourceUrl: customDraft.sourceUrl.trim()
  };
  var idx = -1;
  state.library.forEach(function (d, i) { if (d.id === rec.id) idx = i; });
  if (idx >= 0) state.library[idx] = rec;
  else state.library.push(rec);
  if (draft) draft.selected[rec.id] = true;
  else ui.justAdded = rec.id;
  customDraft = null;
  ui.error = "";
  save();
  go(ui.customReturn === "new" ? "#broker/new" : "#broker/library");
}
function onUpload(itemId, fileList) {
  var c = activeClient();
  if (!c || !fileList || !fileList.length) return;
  var item = c.items.filter(function (i) { return i.id === itemId; })[0];
  if (!item) return;
  var files = Array.prototype.slice.call(fileList);
  if (files.some(function (f) { return f.size > 20 * 1024 * 1024; })) {
    toast((c.lang === "fa") ? FA.tooBig : EN.tooBig);
    return;
  }
  var mapped = files.map(function (f) { return { name: f.name, at: Date.now() }; });
  if (item.status === "Missing" || item.status === "Rejected" || !item.files.length) item.files = mapped;
  else item.files = item.files.concat(mapped);
  item.status = "Uploaded";
  item.reason = "";
  log(c, "Uploaded " + itemLabel(c, item, "en"));
  var email = uploadEmail(c, item);
  state.notifs.unshift({ id: uid(), at: Date.now(), read: false, clientId: c.id, title: email.subject, email: email });
  save();
  toast(c.lang === "fa" ? FA.sent : EN.sent);
}
function remind(c, kind) {
  if (!stats(c).outstanding.length) { toast("Nothing is missing."); return; }
  var email = reminderEmail(c);
  c.reminders.history.push({ at: Date.now(), kind: kind, email: email });
  log(c, (kind === "auto" ? "Automatic" : "Manual") + " reminder emailed");
  save();
  ui.sheet = { type: "email", email: email };
  render();
}
function openHelp(docId) {
  var route = parseRoute();
  var lang = "en";
  var item = null;
  if (route.top === "client") {
    var c = clientFromRoute(route);
    lang = c && c.lang === "fa" ? "fa" : "en";
  } else lang = ui.helpLang || "en";
  ui.sheet = { type: "help", docId: docId, lang: lang, item: item };
  render();
}
function finishAuth() {
  var dest = ui.afterAuth && ui.afterAuth.indexOf("#broker") === 0 && ui.afterAuth.indexOf("passkey") === -1 ? ui.afterAuth : "#broker";
  ui.afterAuth = "#broker";
  go(dest);
}
function onClick(e) {
  var el = e.target.closest("[data-act]");
  if (!el) return;
  var act = el.dataset.act;
  if (act === "new-client") { draft = freshDraft(); ui.error = ""; return; }
  if (act === "preview") { sessionStorage.setItem("mydocs-preview", el.dataset.id); return; }
  if (act === "end-preview") { sessionStorage.removeItem("mydocs-preview"); return; }
  if (act === "edit-lib") { customDraft = null; ui.customReturn = "library"; ui.error = ""; return; }
  if (act === "new-lib") { customDraft = null; ui.customReturn = "library"; ui.error = ""; return; }
  if (act === "close" || act === "goto-custom") {
    if (act === "goto-custom") { readFields(); customDraft = null; ui.customReturn = "new"; ui.error = ""; go("#broker/custom"); return; }
    ui.sheet = null; ui.error = ""; render(); return;
  }
  if (act === "menu") { ui.sheet = { type: "menu" }; render(); return; }
  if (act === "reset-ask") { ui.sheet = { type: "confirm-reset" }; render(); return; }
  if (act === "help") { openHelp(el.dataset.doc); return; }
  if (act === "help-lang" || act === "client-lang") {
    var lang = el.dataset.lang === "fa" ? "fa" : "en";
    if (act === "client-lang") {
      var cc = activeClient();
      if (cc) { cc.lang = lang; save(); }
    }
    ui.helpLang = lang;
    if (ui.sheet && ui.sheet.type === "help") ui.sheet.lang = lang;
    render();
    return;
  }
  if (act === "open-magic") {
    state.session = {
      signedInAt: Date.now(),
      email: ui.signEmail || "broker@example.com",
      passkeyOffered: !!(state.session && state.session.passkeyOffered),
      passkeyEnabled: !!(state.session && state.session.passkeyEnabled)
    };
    save();
    ui.sheet = null;
    if (!state.session.passkeyOffered) go("#broker/passkey");
    else finishAuth();
    return;
  }
  if (act === "face-yes" || act === "face-no") {
    state.session.passkeyOffered = true;
    state.session.passkeyEnabled = act === "face-yes";
    save();
    finishAuth();
    return;
  }
  if (act === "face-in") {
    state.session.signedInAt = Date.now();
    save();
    finishAuth();
    return;
  }
  if (act === "sign-out") {
    if (state.session) state.session.signedInAt = 0;
    ui.sheet = null;
    save();
    go("#signin");
    return;
  }
  if (act === "reset-yes") { resetAll(); return; }
  if (act === "deal") {
    readFields();
    var keep = {};
    state.library.forEach(function (d) { if (draft.selected[d.id]) keep[d.id] = true; });
    draft.type = el.dataset.type;
    draft.selected = Object.assign(presetSet(draft.type), keep);
    render();
    return;
  }
  if (act === "toggle-doc") {
    readFields();
    draft.selected[el.dataset.id] = !draft.selected[el.dataset.id];
    render();
    return;
  }
  if (act === "add-app") { readFields(); draft.applicants.push(""); render(); return; }
  if (act === "rm-app") {
    readFields();
    draft.applicants.splice(Number(el.dataset.index), 1);
    render();
    return;
  }
  if (act === "create") { createClient(); return; }
  if (act === "scope") { readFields(); customDraft.perApplicant = el.dataset.scope === "applicant"; render(); return; }
  if (act === "save-custom") { saveCustom(); return; }
  if (act === "delete-lib") { ui.sheet = { type: "confirm-delete", id: el.dataset.id }; render(); return; }
  if (act === "delete-yes") {
    var id = ui.sheet && ui.sheet.id;
    var lib = state.library.filter(function (d) { return d.id === id; })[0];
    state.clients.forEach(function (c) {
      c.items.forEach(function (item) { if (item.docId === id && lib) item.snapshot = lib; });
    });
    state.library = state.library.filter(function (d) { return d.id !== id; });
    ui.sheet = null;
    save();
    render();
    return;
  }
  if (act === "accept" || act === "reject" || act === "note" || act === "remind" || act === "opt" || act === "rem-on" || act === "download" || act === "hist" || act === "save-contact" || act === "fresh-link" || act === "reject-send" || act === "note-save" || act === "open-notif" || act === "open-client") {
    handleClientAct(act, el);
  }
}
function handleClientAct(act, el) {
  var c = activeClient();
  if (act === "open-notif") {
    var n = state.notifs.filter(function (x) { return x.id === el.dataset.id; })[0];
    if (!n) return;
    n.read = true;
    save();
    ui.sheet = { type: "email", email: n.email };
    render();
    return;
  }
  if (act === "open-client") { ui.sheet = null; go("#broker/c/" + el.dataset.id); return; }
  if (act === "download") {
    ui.sheet = { type: "info", title: "Download all", body: "In the real product this downloads a zip through a signed link that expires in 5 minutes. This demo does not create a file." };
    render();
    return;
  }
  if (!c) return;
  if (act === "remind") { remind(c, "manual"); return; }
  if (act === "fresh-link") { ui.sheet = { type: "email", email: freshLinkEmail(c) }; render(); return; }
  if (act === "rem-on") { c.reminders.enabled = !c.reminders.enabled; save(); render(); return; }
  if (act === "opt") { toggleOpt(c, el.dataset.doc); return; }
  if (act === "hist") {
    var h = c.reminders.history[Number(el.dataset.index)];
    if (h && h.email) { ui.sheet = { type: "email", email: h.email }; render(); }
    return;
  }
  if (act === "accept") {
    var item = c.items.filter(function (i) { return i.id === el.dataset.item; })[0];
    if (!item) return;
    item.status = "Accepted";
    item.reason = "";
    log(c, "Accepted " + itemLabel(c, item, "en"));
    save();
    render();
    return;
  }
  if (act === "reject") {
    ui.error = "";
    ui.sheet = { type: "reject", itemId: el.dataset.item, reason: "" };
    render();
    return;
  }
  if (act === "reject-send") {
    var reasonEl = document.getElementById("reject-reason");
    var reason = reasonEl ? reasonEl.value.trim() : "";
    if (!reason) { ui.error = "Add a short reason."; render(); return; }
    var rej = c.items.filter(function (i) { return i.id === el.dataset.item; })[0];
    if (!rej) return;
    rej.status = "Rejected";
    rej.reason = reason;
    log(c, "Rejected " + itemLabel(c, rej, "en"));
    ui.error = "";
    save();
    ui.sheet = { type: "email", email: rejectionEmail(c, rej) };
    render();
    return;
  }
  if (act === "note") {
    var it = c.items.filter(function (i) { return i.id === el.dataset.item; })[0];
    ui.sheet = { type: "note", itemId: el.dataset.item, text: it ? it.note : "" };
    render();
    return;
  }
  if (act === "note-save") {
    var noteEl = document.getElementById("item-note");
    var target = c.items.filter(function (i) { return i.id === el.dataset.item; })[0];
    if (target) target.note = noteEl ? noteEl.value.trim() : "";
    ui.sheet = null;
    save();
    render();
    return;
  }
  if (act === "save-contact") {
    var phone = val("ct-phone") || c.phone || "";
    var email = val("ct-email") || c.email || "";
    var address = val("ct-address") || "";
    if (!phone.trim() || !email.trim() || !address.trim()) { toast(c.lang === "fa" ? "تلفن، ایمیل و نشانی را پر کنید." : "Add phone, email, and address."); return; }
    c.contact = { phone: phone.trim(), email: email.trim(), address: address.trim() };
    if (ui.contactDrafts) delete ui.contactDrafts[c.id];
    var formItem = c.items.filter(function (i) { return i.id === el.dataset.item; })[0];
    if (formItem) { formItem.status = "Uploaded"; formItem.reason = ""; }
    log(c, "Contact details submitted");
    var mail = uploadEmail(c, formItem || { docId: "contact", applicantId: null, snapshot: null });
    mail.paragraphs = [c.name + " sent their contact details."];
    state.notifs.unshift({ id: uid(), at: Date.now(), read: false, clientId: c.id, title: mail.subject, email: mail });
    save();
    toast(c.lang === "fa" ? FA.saved : EN.saved);
  }
}
function contactDraft(c) {
  ui.contactDrafts = ui.contactDrafts || {};
  if (!ui.contactDrafts[c.id]) {
    var ct = c.contact || { phone: c.phone || "", email: c.email || "", address: "" };
    ui.contactDrafts[c.id] = { phone: ct.phone || "", email: ct.email || "", address: ct.address || "" };
  }
  return ui.contactDrafts[c.id];
}
function val(field) {
  var el = document.querySelector('[data-field="' + field + '"]');
  return el ? el.value : "";
}
function toggleOpt(c, docId) {
  var existing = c.items.filter(function (i) { return i.docId === docId; });
  if (existing.length) {
    if (existing.some(function (i) { return i.files && i.files.length; })) {
      toast("That item has files, so it stays on the list.");
      return;
    }
    c.items = c.items.filter(function (i) { return i.docId !== docId; });
    log(c, "Turned off " + resolve(docId).en.name);
  } else {
    c.items.push({ id: uid(), docId: docId, applicantId: null, status: "Missing", files: [], reason: "", note: "" });
    log(c, "Turned on " + resolve(docId).en.name);
  }
  save();
  render();
}
function onChange(e) {
  var el = e.target;
  if (el.dataset.act === "upload") {
    onUpload(el.dataset.item, el.files);
    el.value = "";
    return;
  }
  var c = activeClient();
  if (!c) return;
  if (el.dataset.field === "rem-first" || el.dataset.field === "rem-every") {
    var n = Math.max(1, Math.min(30, parseInt(el.value, 10) || 1));
    if (el.dataset.field === "rem-first") c.reminders.firstAfterDays = n;
    else c.reminders.everyDays = n;
    save();
  }
}
function onSubmit(e) {
  if (e.target.dataset.form === "signin") {
    e.preventDefault();
    readFields();
    ui.sheet = { type: "email", email: signInEmail() };
    render();
  }
}
function resetAll() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem("mydocs-preview");
  state = seed();
  syncReminders();
  draft = null;
  customDraft = null;
  ui.sheet = null;
  ui.error = "";
  ui.signEmail = "broker@example.com";
  ui.afterAuth = "#broker";
  save();
  go("#signin");
}
function boot() {
  state = load() || seed();
  state.clients.forEach(ensureClient);
  syncReminders();
  save();
  window.addEventListener("hashchange", function () {
    if (!ui.keepSheet) ui.sheet = null;
    ui.keepSheet = false;
    ui.toast = "";
    clearTimeout(ui.toastTimer);
    render();
  });
  document.body.addEventListener("click", onClick);
  document.body.addEventListener("change", onChange);
  document.body.addEventListener("submit", onSubmit);
  document.body.addEventListener("input", function (e) {
    if (e.target.id === "sign-email") ui.signEmail = e.target.value;
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && ui.sheet) { ui.sheet = null; ui.error = ""; render(); }
  });
  if (!location.hash) location.hash = sessionValid() ? "#broker" : "#signin";
  render();
}
boot();
